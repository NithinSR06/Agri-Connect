const express = require('express');
const { createProduct, getProducts, getFarmerProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Public routes (or consumer routes)
router.get('/', getProducts); // Search with filters

// Protected routes (Farmer)
router.post('/', authenticateToken, createProduct);
router.get('/my-products', authenticateToken, getFarmerProducts);
router.patch('/:id', authenticateToken, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;
