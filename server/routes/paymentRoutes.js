const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Tạo URL thanh toán VNPAY
router.post("/vnpay", paymentController.createVnpayPayment);

// Nhận callback từ VNPAY
router.get("/vnpay_return", paymentController.vnpayReturn);

module.exports = router;
