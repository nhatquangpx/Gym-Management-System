const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Lấy danh sách gói tập đã dùng
router.get('/used-packages', [verifyToken, verifyRole(['member'])], feedbackController.getUsedPackages);
// Lấy danh sách HLV đã từng tập
router.get('/used-trainers', [verifyToken, verifyRole(['member'])], feedbackController.getUsedTrainers);
// Gửi feedback
router.post('/', [verifyToken, verifyRole(['member'])], feedbackController.createFeedback);
// Lấy lịch sử feedback
router.get('/history', [verifyToken, verifyRole(['member'])], feedbackController.getFeedbackHistory);

router.use(verifyToken); // hoặc authenticateMember

module.exports = router;
