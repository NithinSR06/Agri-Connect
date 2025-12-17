const express = require('express');
const cors = require('cors');
const { initDb } = require('./database');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.set('trust proxy', 1); // Trust Vercel proxy
app.use(cors());
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Simple Test Route
app.get('/api/test', (req, res) => {
    console.log('Test Request Received!');
    res.json({ message: 'API is working!', timestamp: new Date() });
});

// Initialize Database (Async, but we don't await it to avoid blocking cold starts, errors logged)
initDb().catch(err => console.error('DB Init Error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('AgriConnect API is running');
});

// Debug Catch-all for 404
app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Only listen if not running in Vercel (local dev)
// Always listen (Required for Render and Local)
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
