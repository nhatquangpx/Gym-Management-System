const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const { verifyToken } = require('../middleware/authMiddleware');

// @route   POST /api/registration/register-member
// @desc    Đăng ký thành viên mới và tạo đơn hàng gói tập
router.post('/register-member', registrationController.registerMember);

// @route   POST /api/registration/activate-after-payment
// @desc    Kích hoạt tài khoản sau khi thanh toán thành công
router.post('/activate-after-payment', verifyToken, registrationController.activateAfterPayment);

module.exports = router;