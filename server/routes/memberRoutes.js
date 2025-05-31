const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const memberController = require("../controllers/memberController");
const { createMemberValidation, updateMemberValidation, createMemberFromUserValidation, packageValidation } = require("../validations/memberValidation");
const verifyActiveMember = require("../middleware/memberActiveMiddleware");
const scheduleController = require("../controllers/scheduleController");

router.get('/get-schedules/:memberId', [verifyToken, verifyRole(["member"])], scheduleController.getSchedulesByMember);

router.post('/add-schedule', [verifyToken, verifyRole(["member"]), verifyActiveMember], scheduleController.memberAddSchedule);

router.put('/update-schedule/:id', [verifyToken, verifyRole(["member"]), verifyActiveMember], scheduleController.updateSchedule);

router.get('/info/:id', [verifyToken, verifyRole(["member"])], memberController.getMemberById);

router.put('/info/update/:id', [verifyToken, verifyRole(["member"])], memberController.updateMember);

router.delete('/delete-schedule/:id', [verifyToken, verifyRole(["member"]), verifyActiveMember], scheduleController.deleteSchedule);
// @route   POST /api/members
// @desc    Create a new member
// @access  Private (Admin)
router.post("/", [verifyToken, verifyRole(["admin", "employee"]), createMemberValidation], memberController.createMember);

// @route   POST /api/members/from-user
// @desc    Create a new member from existing user
// @access  Private (Admin)
router.post("/from-user", [verifyToken, verifyRole(["admin", "employee"]), createMemberFromUserValidation], memberController.createMemberFromExistingUser);

// @route   PUT /api/members/:id
// @desc    Update member information
// @access  Private (Admin)
router.put("/:id", [verifyToken, verifyRole(["admin", "employee"]), updateMemberValidation], memberController.updateMember);

// @route   GET /api/members
// @desc    Get all members
// @access  Private (Admin)
router.get("/", [verifyToken, verifyRole(["admin", "employee"])], memberController.getAllMembers);

// @route   GET /api/members/:id
// @desc    Get member by ID
// @access  Private (Admin)
router.get("/:id", [verifyToken, verifyRole(["admin", "employee"])], memberController.getMemberById);

// @route   DELETE /api/members/:id
// @desc    Delete member
// @access  Private (Admin)
router.delete("/:id", [verifyToken, verifyRole(["admin", "employee"])], memberController.deleteMember);

// Package management routes
// @route   GET /api/members/:id/package-status
// @desc    Get member's current package status
// @access  Private (Admin)
router.get("/:id/package-status", [verifyToken, verifyRole(["admin", "employee"])], memberController.getPackageStatus);

// @route   POST /api/members/:id/cancel-package
// @desc    Cancel current package
// @access  Private (Admin)
router.post("/:id/cancel-package", [verifyToken, verifyRole(["admin", "employee"])], memberController.cancelPackage);

// @route   POST /api/members/:id/register-package
// @desc    Register new package
// @access  Private (Admin)
router.post("/:id/register-package", [verifyToken, verifyRole(["admin", "employee"])], memberController.registerPackage);

// @route   POST /api/members/:id/renew-package
// @desc    Renew package
// @access  Private (Admin)
router.post("/:id/renew-package", [verifyToken, verifyRole(["admin", "employee"])], memberController.renewPackage);

module.exports = router; 