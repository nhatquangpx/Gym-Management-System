const express = require("express");
const router = express.Router();
const { register, login, forgotPassword, resetPassword, adminAccess, trainerAccess, staffAccess, memberAccess } = require("../controllers/authController");
const { verifyToken, verifyRole, redirectIfAuthenticated } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", redirectIfAuthenticated, login);
router.get("/forgotpassword", forgotPassword);
router.post("/resetpassword", verifyToken, resetPassword);

router.get("/admin", verifyToken, verifyRole(["admin"]), adminAccess);
router.get("/trainer", verifyToken, verifyRole(["trainer"]), trainerAccess);
router.get("/staff", verifyToken, verifyRole(["employee"]), staffAccess);
router.get("/", verifyToken, memberAccess);

module.exports = router;
