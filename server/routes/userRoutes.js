const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

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
// Lấy phản hồi của người dùng về một gói tập cụ thể
router.get('/my-feedback/:packageId', [verifyToken, verifyRole(["member"])], userController.getPackageFeedback);

module.exports = router;
