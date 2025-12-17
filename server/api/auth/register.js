const { pool } = require('../../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

module.exports = async (req, res) => {
    // Enable CORS manually for this function
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Content-Type, Authorization, Accept'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { name, email, password, role, location_lat, location_lng, location_text } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check user
        const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        const kycStatus = role === 'admin' ? 'verified' : 'pending';
        const insertQuery = `
            INSERT INTO users (name, email, password_hash, role, location_lat, location_lng, location_text, kyc_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;

        const result = await pool.query(insertQuery, [name, email, hashedPassword, role, location_lat, location_lng, location_text, kycStatus]);
        const userId = result.rows[0].id;

        const token = jwt.sign({ id: userId, email, role }, JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: userId, name, email, role, kyc_status: kycStatus }
        });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message });
    }
};
