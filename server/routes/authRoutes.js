const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword, adminAccess, trainerAccess, staffAccess, memberAccess } = require("../controllers/authController");
const { verifyToken,  redirectIfAuthenticated } = require("../middleware/authMiddleware");
const { registerValidation, validate } = require("../validations/registerValidation");

router.post("/register", registerValidation, validate, register);
router.post("/login", redirectIfAuthenticated, login);
router.get("/forgotpassword", forgotPassword);
router.post("/resetpassword", verifyToken, resetPassword);

module.exports = router;
