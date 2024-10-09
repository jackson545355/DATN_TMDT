const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const upload = require('../utils/upload');
const authMiddleware = require('../middleware/authMiddleware');
const uploadFile = require('../utils/uploadFile');

router.post('/create-one/',upload.array('images', 4), productController.createOneProduct);
router.post('/create-many/', productController.createManyProduct);
router.get('/get-one-by-id/:id', productController.getProductById);
router.get('/get-many-by-ids/:ids', productController.getProductByIds);
router.put('/update-one-by-id/:id', productController.updateProduct);
router.put('/update-many/', productController.updateManyProducts);
router.delete('/delete-one-by-id/:id', productController.deleteProduct);
router.post('/:id/comments' ,authMiddleware , productController.addComment);
router.get('/:id/comments', productController.getCommentsByProductId);
router.get('/getAll/',productController.GetAll)
router.get('/getLimit/',productController.GetLimit)

router.post('/create-by-file/',uploadFile.single('file'),productController.createByFile);

module.exports = router;
