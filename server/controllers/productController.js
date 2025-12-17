const { pool } = require('../database');

const createProduct = async (req, res) => {
    const { crop_name, price_per_kg, available_qty, harvest_date, description, image_url } = req.body;
    const farmer_id = req.user.id; // From auth middleware

    if (req.user.role !== 'farmer') {
        return res.status(403).json({ message: 'Only farmers can create products' });
    }

    if (!crop_name || !price_per_kg || !available_qty) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const query = `
            INSERT INTO products (farmer_id, crop_name, price_per_kg, available_qty, harvest_date, description, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `;
        const result = await pool.query(query, [farmer_id, crop_name, price_per_kg, available_qty, harvest_date, description, image_url]);

        res.status(201).json({
            message: 'Product created successfully',
            product: result.rows[0]
        });
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
};

const getProducts = async (req, res) => {
    const { lat, lng, radius, crop_name } = req.query;

    try {
        let queryText = `
            SELECT p.*, u.name as farmer_name, u.location_lat, u.location_lng, u.location_text
            FROM products p
            JOIN users u ON p.farmer_id = u.id
            WHERE p.available_qty > 0
        `;
        const params = [];

        if (crop_name) {
            queryText += ` AND p.crop_name ILIKE $1`;
            params.push(`%${crop_name}%`);
        }

        queryText += ` ORDER BY p.created_at DESC`;

        const result = await pool.query(queryText, params);
        let rows = result.rows;

        // Filter by location radius if lat/lng provided
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const radiusKm = parseFloat(radius) || 20;

            rows = rows.filter(product => {
                if (!product.location_lat || !product.location_lng) return false;
                const distance = getDistanceFromLatLonInKm(userLat, userLng, parseFloat(product.location_lat), parseFloat(product.location_lng));
                return distance <= radiusKm;
            });
        }

        res.json(rows);
    } catch (error) {
        console.error('Get Products Error:', error);
        res.status(500).json({ message: 'Database error' });
    }
};

const getFarmerProducts = async (req, res) => {
    const farmer_id = req.user.id;

    try {
        const result = await pool.query('SELECT * FROM products WHERE farmer_id = $1', [farmer_id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Database error' });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { price_per_kg, available_qty } = req.body;
    const farmer_id = req.user.id;

    try {
        const result = await pool.query(
            'UPDATE products SET price_per_kg = $1, available_qty = $2 WHERE id = $3 AND farmer_id = $4',
            [price_per_kg, available_qty, id, farmer_id]
        );

        if (result.rowCount === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Database error' });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const farmer_id = req.user.id;

    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 AND farmer_id = $2', [id, farmer_id]);

        if (result.rowCount === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Database error' });
    }
};

// Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

module.exports = { createProduct, getProducts, getFarmerProducts, updateProduct, deleteProduct };
