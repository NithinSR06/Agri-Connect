const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database');
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
        db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            if (row) return res.status(400).json({ message: 'Email already registered' });

            const stmt = db.prepare(`
        INSERT INTO users (name, email, password_hash, role, location_lat, location_lng, location_text, kyc_status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

            const kycStatus = role === 'admin' ? 'verified' : 'pending'; // Auto-verify admin for demo, others pending

            stmt.run(name, email, hashedPassword, role, location_lat, location_lng, location_text, kycStatus, function (err) {
                if (err) return res.status(500).json({ message: 'Error creating user' });

                const token = jwt.sign({ id: this.lastID, email, role }, JWT_SECRET, { expiresIn: '24h' });
                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: { id: this.lastID, name, email, role, kyc_status: kycStatus }
                });
            });
            stmt.finalize();
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ message: 'Database error' });
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
    });
};

module.exports = { register, login };
