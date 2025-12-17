const express = require('express');
const cors = require('cors');
const { initDb } = require('./database');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Default permissive CORS (Origin: *) - safer than custom config with credentials
app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Static files don't work well in serverless without S3, commenting out for now

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

// Only listen if not running in Vercel (local dev)
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
