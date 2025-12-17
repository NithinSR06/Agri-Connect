const { pool } = require('../../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

module.exports = async (req, res) => {
    // Enable CORS manually
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

    // DUMMY RESPONSE - NO DB
    console.log("Register Function Hit!");
    res.status(201).json({
        message: 'User registered successfully (DUMMY)',
        token: 'dummy_token',
        user: { id: 1, name: 'Test', email: 'test@test.com', role: 'farmer', kyc_status: 'verified' }
    });
};
