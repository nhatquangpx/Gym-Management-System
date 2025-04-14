const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const memberController = require("../controllers/memberController");
const { createMemberValidation, updateMemberValidation, createMemberFromUserValidation } = require("../validations/memberValidation");


router.post("/", [verifyToken, verifyRole(["admin"]), createMemberValidation], memberController.createMember);
router.post("/from-user", [verifyToken, verifyRole(["admin"]), createMemberFromUserValidation], memberController.createMemberFromExistingUser);

router.put("/:id", [verifyToken, verifyRole(["admin"]), updateMemberValidation], memberController.updateMember);

router.get("/", [verifyToken, verifyRole(["admin"])], memberController.getAllMembers);

router.get("/:id", [verifyToken, verifyRole(["admin"])], memberController.getMemberById);

router.delete("/:id", [verifyToken, verifyRole(["admin"])], memberController.deleteMember);

module.exports = router; 