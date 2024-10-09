const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create-one/', authMiddleware, cartController.createCart);
router.get('/get-one-by-user-id/', authMiddleware, cartController.getCartByUserId);
router.post('/add-product/', authMiddleware, cartController.addProduct);
router.delete('/remove-products/', authMiddleware, cartController.removeProducts);
router.patch('/update-products/', authMiddleware, cartController.UpdateProducts);

module.exports = router;
