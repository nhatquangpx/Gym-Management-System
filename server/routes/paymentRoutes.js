const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { verifyToken } = require("../middleware/authMiddleware");

// Tạo URL thanh toán VNPAY
router.post("/vnpay", paymentController.createVnpayPayment);

// Nhận callback từ VNPAY
router.get("/vnpay_return", paymentController.vnpayReturn);

// Tạo đơn hàng cho thanh toán thủ công (banking, momo)
router.post("/manual", paymentController.createManualOrder);

module.exports = router;
