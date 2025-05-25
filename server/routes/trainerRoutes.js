const express = require("express");
const router = express.Router();
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");
const trainerController = require("../controllers/trainerController");


// @route   GET /api/trainers/dashboard-stats
// @desc    Lấy thống kê dashboard của huấn luyện viên
// @access  Private (Trainer)
router.get('/dashboard-stats', [verifyToken, verifyRole(["trainer"])], trainerController.getTrainerDashboardStats);

// @route   GET /api/trainers/today-schedule
// @desc    Lấy lịch tập hôm nay của huấn luyện viên
// @access  Private (Trainer)
router.get('/today-schedule', [verifyToken, verifyRole(["trainer"])], trainerController.getTodaySchedule);

// @route   GET /api/trainers/trainees
// @desc    Lấy danh sách học viên của huấn luyện viên
// @access  Private (Admin, Trainer)
router.get("/trainees", [verifyToken, verifyRole(["trainer"])], trainerController.getTrainerTrainees);

// @route   POST /api/trainers/add-schedule
// @desc    Thêm lịch tập mới
// @access  Private (Trainer)
router.post("/add-schedule", [verifyToken, verifyRole(["trainer"])], trainerController.addSchedule);

// @route   PUT /api/trainers/update-schedule/:scheduleId
// @desc    Cập nhật lịch tập
// @access  Private (Trainer)
router.put('/update-schedule/:id', [verifyToken, verifyRole(["trainer"])], trainerController.updateSchedule);

// @route   DELETE /api/trainers/delete-schedule/:id
// @desc    Xóa lịch tập
// @access  Private (Trainer)
router.delete('/delete-schedule/:id', [verifyToken, verifyRole(['trainer'])], trainerController.deleteSchedule);

// @route   GET /api/trainers/get-all-schedule
// @desc    Lấy tất cả lịch tập của huấn luyện viên
// @access  Private (Trainer)
router.get('/get-all-schedule', [verifyToken, verifyRole(['admin', 'trainer'])], trainerController.getAllSchedules);

// @route   GET /api/trainers/get-schedule-by-id/:memberId
// @desc    Lấy lịch tập theo học viên
// @access  Private (Trainer)
router.get('/get-schedule-by-id/:memberId', [verifyToken, verifyRole(['admin', 'trainer'])], trainerController.getSchedulesByMember);

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
