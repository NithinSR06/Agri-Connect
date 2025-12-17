const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../database');
const { JWT_SECRET } = require('../middleware/auth');

const register = async (req, res) => {
    const { name, email, password, role, location_lat, location_lng, location_text } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['farmer', 'consumer', 'admin'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user exists
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
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                kyc_status: user.kyc_status,
                location_lat: user.location_lat,
                location_lng: user.location_lng,
                location_text: user.location_text
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { register, login };
