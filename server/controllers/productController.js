const { db } = require('../database');

const createProduct = (req, res) => {
    const { crop_name, price_per_kg, available_qty, harvest_date, description, image_url } = req.body;
    const farmer_id = req.user.id; // From auth middleware

    if (req.user.role !== 'farmer') {
        return res.status(403).json({ message: 'Only farmers can create products' });
    }

    if (!crop_name || !price_per_kg || !available_qty) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const stmt = db.prepare(`
    INSERT INTO products (farmer_id, crop_name, price_per_kg, available_qty, harvest_date, description, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    stmt.run(farmer_id, crop_name, price_per_kg, available_qty, harvest_date, description, image_url, function (err) {
        if (err) return res.status(500).json({ message: 'Error creating product' });
        res.status(201).json({
            message: 'Product created successfully',
            product: { id: this.lastID, farmer_id, crop_name, price_per_kg, available_qty, harvest_date, description, image_url }
        });
    });
    stmt.finalize();
};

const getProducts = (req, res) => {
    const { lat, lng, radius, crop_name } = req.query;

    let query = `
    SELECT p.*, u.name as farmer_name, u.location_lat, u.location_lng, u.location_text
    FROM products p
    JOIN users u ON p.farmer_id = u.id
    WHERE p.available_qty > 0
    ORDER BY p.created_at DESC
  `;

    const params = [];

    if (crop_name) {
        query += ` AND p.crop_name LIKE ?`;
        params.push(`%${crop_name}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        // Filter by location radius if lat/lng provided
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const radiusKm = parseFloat(radius) || 20;

            const filteredProducts = rows.filter(product => {
                if (!product.location_lat || !product.location_lng) return false;
                const distance = getDistanceFromLatLonInKm(userLat, userLng, product.location_lat, product.location_lng);
                return distance <= radiusKm;
            });
            return res.json(filteredProducts);
        }

        res.json(rows);
    });
};

const getFarmerProducts = (req, res) => {
    const farmer_id = req.user.id;

    db.all('SELECT * FROM products WHERE farmer_id = ?', [farmer_id], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { price_per_kg, available_qty } = req.body;
    const farmer_id = req.user.id;

    db.run(
        'UPDATE products SET price_per_kg = ?, available_qty = ? WHERE id = ? AND farmer_id = ?',
        [price_per_kg, available_qty, id, farmer_id],
        function (err) {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (this.changes === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });
            res.json({ message: 'Product updated successfully' });
        }
    );
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    const farmer_id = req.user.id;

    db.run('DELETE FROM products WHERE id = ? AND farmer_id = ?', [id, farmer_id], function (err) {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (this.changes === 0) return res.status(404).json({ message: 'Product not found or unauthorized' });
        res.json({ message: 'Product deleted successfully' });
    });
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
