const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword, adminAccess, trainerAccess, staffAccess, memberAccess } = require("../controllers/authController");
const { verifyToken,  redirectIfAuthenticated } = require("../middlewares/authMiddleware");
const {registerValidation, validate} = require("../middlewares/registerValidation");

router.post("/register", registerValidation, validate, register);
router.post("/login", redirectIfAuthenticated, login);
router.get("/forgotpassword", forgotPassword);
router.post("/resetpassword", verifyToken, resetPassword);

module.exports = router;
