const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

// Tạo mới package (chỉ admin)
router.post("/", [verifyToken, verifyRole(["admin", "employee"])], packageController.createPackage);
// Lấy danh sách package
router.get("/", packageController.getAllPackages);
// Lấy chi tiết package
router.get("/:id", packageController.getPackageById);
// Cập nhật package (chỉ admin)
router.put("/:id", [verifyToken, verifyRole(["admin", "employee"])], packageController.updatePackage);
// Xóa package (chỉ admin)
router.delete("/:id", [verifyToken, verifyRole(["admin", "employee"])], packageController.deletePackage);

module.exports = router;
