const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const trainerController = require("../controllers/trainerController");

// @route   POST /api/trainers
// @desc    Create a new trainer
// @access  Private (Admin)
router.post("/", [verifyToken, verifyRole(["admin"])], trainerController.createTrainer);

// @route   POST /api/trainers/from-user
// @desc    Create a new trainer from existing user
// @access  Private (Admin)
router.post("/from-user", [verifyToken, verifyRole(["admin"])], trainerController.createTrainerFromExistingUser);

// @route   PUT /api/trainers/:id
// @desc    Update trainer information
// @access  Private (Admin)
router.put("/:id", [verifyToken, verifyRole(["admin"])], trainerController.updateTrainer);

// @route   GET /api/trainers
// @desc    Get all trainers
// @access  Private (Admin)
router.get("/", [verifyToken, verifyRole(["admin"])], trainerController.getAllTrainers);

// @route   GET /api/trainers/:id
// @desc    Get trainer by ID
// @access  Private (Admin)
router.get("/:id", [verifyToken, verifyRole(["admin"])], trainerController.getTrainerById);

// @route   DELETE /api/trainers/:id
// @desc    Delete trainer
// @access  Private (Admin)
router.delete("/:id", [verifyToken, verifyRole(["admin"])], trainerController.deleteTrainer);

module.exports = router;
