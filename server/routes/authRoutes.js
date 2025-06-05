const express = require("express");
const router = express.Router();
const { login, register, forgotPassword, resetPassword, checkExistedEmail} = require("../controllers/authController");
const { verifyToken,  redirectIfAuthenticated } = require("../middleware/authMiddleware");


router.post("/check-existed-email", checkExistedEmail);
router.post("/register", register);
router.post("/login", redirectIfAuthenticated, login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", verifyToken, resetPassword);

module.exports = router;
