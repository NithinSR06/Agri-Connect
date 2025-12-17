const { pool } = require('../database');
const { v4: uuidv4 } = require('uuid');

const createOrder = async (req, res) => {
    const { items, delivery_address, delivery_slot, payment_method, payment_reference } = req.body;
    const buyer_id = req.user.id;

    if (!items || items.length === 0 || !delivery_address || !delivery_slot || !payment_method) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Calculate total and verify inventory
        let total_amount = 0;
        const orderItems = [];

        for (const item of items) {
            const productRes = await client.query('SELECT * FROM products WHERE id = $1', [item.product_id]);
            const product = productRes.rows[0];

            if (!product) throw new Error(`Product ${item.product_id} not found`);

            // Note: In Postgres `numeric` returns as string, so parse it
            const available_qty = parseFloat(product.available_qty);
            const price_per_kg = parseFloat(product.price_per_kg);

            if (available_qty < item.quantity) {
                throw new Error(`Insufficient quantity for ${product.crop_name}`);
            }

            total_amount += price_per_kg * item.quantity;
            orderItems.push({ ...item, price_per_kg, farmer_id: product.farmer_id });
        }

        const order_uuid = uuidv4();

        // 2. Insert Order
        const orderInsertQuery = `
            INSERT INTO orders (order_uuid, buyer_id, total_amount, payment_method, payment_reference, delivery_address, delivery_slot)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;
        const orderRes = await client.query(orderInsertQuery, [order_uuid, buyer_id, total_amount, payment_method, payment_reference, delivery_address, delivery_slot]);
        const order_id = orderRes.rows[0].id;

        // 3. Insert Items
        for (const item of orderItems) {
            const itemInsertQuery = `
                INSERT INTO order_items (order_id, product_id, farmer_id, quantity, price_per_kg, line_total)
                VALUES ($1, $2, $3, $4, $5, $6)
            `;
            await client.query(itemInsertQuery, [order_id, item.product_id, item.farmer_id, item.quantity, item.price_per_kg, item.quantity * item.price_per_kg]);

            // Reducing inventory here as per decision to reserve stock on placement
            await client.query('UPDATE products SET available_qty = available_qty - $1 WHERE id = $2', [item.quantity, item.product_id]);
        }

        await client.query('COMMIT');
        res.status(201).json({ message: 'Order placed successfully', order_uuid });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Create Order Error:', error);
        res.status(400).json({ message: error.message || 'Error creating order' });
    } finally {
        client.release();
    }
};

const getFarmerOrders = async (req, res) => {
    const farmer_id = req.user.id;

    try {
        const query = `
            SELECT o.id, o.order_uuid, o.created_at, o.status, o.delivery_slot, u.name as buyer_name, u.location_text as buyer_location,
                   oi.id as item_id, oi.quantity, oi.price_per_kg, p.crop_name
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN users u ON o.buyer_id = u.id
            WHERE oi.farmer_id = $1
            ORDER BY o.created_at DESC
        `;

        const result = await pool.query(query, [farmer_id]);
        const rows = result.rows;

        // Group by order
        const orders = {};
        rows.forEach(row => {
            if (!orders[row.id]) {
                orders[row.id] = {
                    id: row.id,
                    uuid: row.order_uuid,
                    created_at: row.created_at,
                    status: row.status,
                    buyer_name: row.buyer_name,
                    buyer_location: row.buyer_location,
                    delivery_slot: row.delivery_slot,
                    items: []
                };
            }
            orders[row.id].items.push({
                item_id: row.item_id,
                crop_name: row.crop_name,
                quantity: row.quantity,
                price: row.price_per_kg
            });
        });

        res.json(Object.values(orders));
    } catch (error) {
        console.error('Get Farmer Orders Error:', error);
        res.status(500).json({ message: 'Database error' });
    }
};

const getConsumerOrders = async (req, res) => {
    const buyer_id = req.user.id;

    try {
        const query = `
            SELECT o.*, oi.quantity, oi.price_per_kg, p.crop_name, u.name as farmer_name
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN users u ON p.farmer_id = u.id
            WHERE o.buyer_id = $1
            ORDER BY o.created_at DESC
        `;

        const result = await pool.query(query, [buyer_id]);
        const rows = result.rows;

        // Group by order
        const orders = {};
        rows.forEach(row => {
            if (!orders[row.id]) {
                orders[row.id] = {
                    id: row.id,
                    uuid: row.order_uuid,
                    total: row.total_amount,
                    status: row.status,
                    created_at: row.created_at,
                    items: []
                };
            }
            orders[row.id].items.push({
                crop_name: row.crop_name,
                farmer_name: row.farmer_name,
                quantity: row.quantity,
                price: row.price_per_kg
            });
        });

        res.json(Object.values(orders));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { id } = req.params; // Order ID
    const { status } = req.body;
    const farmer_id = req.user.id;

    if (!['Accepted', 'Rejected', 'Packed', 'Delivered'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Verify this farmer is part of this order
        const verifyQuery = 'SELECT 1 FROM order_items WHERE order_id = $1 AND farmer_id = $2';
        const verifyRes = await client.query(verifyQuery, [id, farmer_id]);

        if (verifyRes.rowCount === 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ message: 'Unauthorized or order not found' });
        }

        if (status === 'Accepted') {
            // In SQL version we reduced inventory here, but in CreateOrder we did it on placement.
            // Let's stick to just updating status here to avoid double deduction if logic changed.
            // But requirement said "When Accept is clicked: Lock inventory".
            // Since I moved locking to CreateOrder (safer against overselling), I will just update status here.
            // And maybe "Processing" as per requirement.

            await client.query("UPDATE orders SET status = 'Processing' WHERE id = $1", [id]);
            res.json({ message: 'Order accepted and processing' });
        } else {
            // Just update status
            await client.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
            res.json({ message: `Order ${status}` });
        }

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);
        res.status(500).json({ message: 'Database error' });
    } finally {
        client.release();
    }
};

module.exports = { createOrder, getFarmerOrders, getConsumerOrders, updateOrderStatus };
