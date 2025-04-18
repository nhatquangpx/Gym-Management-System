const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

// Lấy các gói tập đã mua thành công của user hiện tại
router.get('/my-packages', verifyToken, userController.getMyPackages);
// Lấy danh sách tất cả người dùng
router.get('/', userController.getAllUsers);
// Lấy thông tin 1 người dùng
router.get('/:id', userController.getUserById);
// Tạo người dùng mới
router.post('/', userController.createUser);
// Cập nhật thông tin người dùng
router.put('/:id', userController.updateUser);
// Xóa người dùng
router.delete('/:id', userController.deleteUser);

module.exports = router;
