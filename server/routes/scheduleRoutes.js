const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');
const {
    getSchedulesByMember,
    trainerAddSchedule,
    memberAddSchedule,
    updateSchedule,
    deleteSchedule,
    getAllSchedules,
    getSchedulesByTrainer,
    getSchedulesByDate
} = require('../controllers/scheduleController');

// Lấy lịch tập theo học viên
router.get('/member/:memberId', verifyToken, getSchedulesByMember);

// Thêm lịch tập (cho trainer)
router.post('/trainer', verifyToken, verifyRole(['trainer']), trainerAddSchedule);

// Cập nhật lịch tập
router.put('/:id', verifyToken, updateSchedule);

// Xóa lịch tập
router.delete('/:id', verifyToken, deleteSchedule);

// Lấy tất cả lịch tập (cho admin)
router.get('/', verifyToken, verifyRole(['admin']), getAllSchedules);

// Lấy lịch tập theo trainer
router.get('/trainer/:trainerId', verifyToken, verifyRole(['trainer', 'admin']), getSchedulesByTrainer);

// Lấy lịch tập theo ngày
router.get('/date/:date', verifyToken, verifyRole(['admin', 'trainer']), getSchedulesByDate);

module.exports = router;
