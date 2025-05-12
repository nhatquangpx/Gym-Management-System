const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const employeeController = require("../controllers/employeeController");

// @route   POST /api/employees
// @desc    Create a new employee
// @access  Private (Admin)
router.post("/", [verifyToken, verifyRole(["admin"])], employeeController.createEmployee);

// @route   POST /api/employees/from-user
// @desc    Create a new employee from existing user
// @access  Private (Admin)
router.post("/from-user", [verifyToken, verifyRole(["admin"])], employeeController.createEmployeeFromExistingUser);

// @route   PUT /api/employees/:id
// @desc    Update employee information
// @access  Private (Admin)
router.put("/:id", [verifyToken, verifyRole(["admin"])], employeeController.updateEmployee);

// @route   GET /api/employees
// @desc    Get all employees
// @access  Private (Admin)
router.get("/", [verifyToken, verifyRole(["admin"])], employeeController.getAllEmployees);

// @route   GET /api/employees/:id
// @desc    Get employee by ID
// @access  Private (Admin)
router.get("/:id", [verifyToken, verifyRole(["admin"])], employeeController.getEmployeeById);

// @route   DELETE /api/employees/:id
// @desc    Delete employee
// @access  Private (Admin)
router.delete("/:id", [verifyToken, verifyRole(["admin"])], employeeController.deleteEmployee);

module.exports = router;
