const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

router.post('/register', authController.register);
router.post('/login', authController.login);
// Route để lấy thông tin người dùng
router.get('/profile', authMiddleware, authController.getProfile);

// Route để cập nhật thông tin người dùng
router.put('/profile', authMiddleware, authController.updateProfile);

// Route để trả về danh sách người dùng
router.get('/users', authController.getUsers);

// Lấy tên người dùng theo ID
router.get('/user/:id/fullname', authController.getNameById);

router.get('/users/avatars', authController.getAvatarsByUsernames);


//uppdat ảnh
router.put('/profile-image/', authMiddleware,upload.single('profileImage'), authController.updateProfileImage);

module.exports = router;