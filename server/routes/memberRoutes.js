const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const memberController = require("../controllers/memberController");
const { createMemberValidation, updateMemberValidation, createMemberFromUserValidation } = require("../validations/memberValidation");

// @route   POST /api/members
// @desc    Create a new member
// @access  Private (Admin)
router.post("/", [verifyToken, verifyRole(["admin"]), createMemberValidation], memberController.createMember);

// @route   POST /api/members/from-user
// @desc    Create a new member from existing user
// @access  Private (Admin)
router.post("/from-user", [verifyToken, verifyRole(["admin"]), createMemberFromUserValidation], memberController.createMemberFromExistingUser);

// @route   PUT /api/members/:id
// @desc    Update member information
// @access  Private (Admin)
router.put("/:id", [verifyToken, verifyRole(["admin"]), updateMemberValidation], memberController.updateMember);

// @route   GET /api/members
// @desc    Get all members
// @access  Private (Admin)
router.get("/", [verifyToken, verifyRole(["admin"])], memberController.getAllMembers);

// @route   GET /api/members/:id
// @desc    Get member by ID
// @access  Private (Admin)
router.get("/:id", [verifyToken, verifyRole(["admin"])], memberController.getMemberById);

// @route   DELETE /api/members/:id
// @desc    Delete member
// @access  Private (Admin)
router.delete("/:id", [verifyToken, verifyRole(["admin"])], memberController.deleteMember);

module.exports = router; 