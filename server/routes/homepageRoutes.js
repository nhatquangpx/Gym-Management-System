const express = require("express");
const { verifyToken, verifyRole } = require("../middlewares/authMiddleware");
const router = express.Router();
const {adminAccess, trainerAccess, staffAccess, memberAccess} = require("../controllers/authController");

router.get("/admin", verifyToken, verifyRole(["admin"]), adminAccess);
router.get("/trainer", verifyToken, verifyRole(["trainer"]), trainerAccess);
router.get("/staff", verifyToken, verifyRole(["employee"]), staffAccess);
router.get("/", verifyToken, memberAccess);

module.exports = router;