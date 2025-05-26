const express = require('express');
const router = express.Router();
const membershipHistoryController = require('../controllers/membershipHistoryController');
const { verifyToken } = require('../middleware/authMiddleware');

// Lấy lịch sử gói tập của thành viên
router.get('/user/:userId', verifyToken, membershipHistoryController.getMembershipHistoryByUser);

// Lấy lịch sử gói tập của thành viên hiện tại
router.get('/my-history', verifyToken, membershipHistoryController.getMyMembershipHistory);

// Lấy thông tin chi tiết về một lịch sử gói tập cụ thể
router.get('/:id', verifyToken, membershipHistoryController.getMembershipHistoryById);

// Cập nhật thông tin lịch sử gói tập
router.put('/:id', verifyToken, membershipHistoryController.updateMembershipHistory);

// Đánh dấu gói tập đã hủy
router.put('/:id/cancel', verifyToken, membershipHistoryController.cancelMembership);

module.exports = router;
