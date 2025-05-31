const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

// Create a new manual order (public)
router.post("/manual", orderController.createManualOrder);

// Get all orders (admin only)
router.get("/", [verifyToken, verifyRole(["admin", "employee"])], orderController.getAllOrders);

// Get user's orders (authenticated user)
router.get("/user", verifyToken, orderController.getUserOrders);

// Get order by transaction reference (public - needed for payment return page)
router.get("/by-txnref/:txnRef", orderController.getOrderByTxnRef);

// Get order by ID (admin or order owner)
router.get("/:id", verifyToken, orderController.getOrderById);

// Update order status (admin only)
router.patch("/:id/status", [verifyToken, verifyRole(["admin", "employee"])], orderController.updateOrderStatus);

// Upload receipt for manual payment (public)
router.post("/upload-receipt", orderController.uploadReceipt);

module.exports = router;
