const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createOrder',authMiddleware, orderController.createOrder);
router.delete('/deleteOrderByID/:id', orderController.deleteOrderByID);

router.get('/getOrder', authMiddleware,orderController.getOrders);
router.get('/getOrderByID/:id',authMiddleware, orderController.getOrdersByID);

router.get('/getOrderbyUserID/',authMiddleware,orderController.getOrderByUserID)

router.get('/all',orderController.getAllOrders); // Thêm route mới để lấy tất cả các đơn hàng

router.post('/momo', orderController.payMomo)

router.post('/callback',orderController.callback)

router.post('/transactionStatus',orderController.transactionStatus)

router.put('/updateOrderStatus', orderController.updateOrderStatus);

router.post('/updateProductStocks', orderController.updateProductStocks);

router.put('/updateReviewStatus/:productId', authMiddleware, orderController.updateReviewStatus);
router.get('/predictProduct',orderController.predictProduct)

router.get('/predictRevenue', orderController.predictRevenue);

router.get('/generateFakeOrders', orderController.generateFakeOrders);

// Router để tự động kiểm tra và cập nhật các trường thời gian bị thiếu
router.put('/autoUpdateOrderTimes', orderController.autoUpdateOrderTimes);

module.exports = router;
