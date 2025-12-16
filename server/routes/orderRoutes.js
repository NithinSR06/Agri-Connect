const express = require('express');
const { createOrder, getFarmerOrders, getConsumerOrders, updateOrderStatus } = require('../controllers/orderController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createOrder);
router.get('/farmer', authenticateToken, getFarmerOrders);
router.get('/consumer', authenticateToken, getConsumerOrders);
router.patch('/:id/status', authenticateToken, updateOrderStatus);

module.exports = router;
