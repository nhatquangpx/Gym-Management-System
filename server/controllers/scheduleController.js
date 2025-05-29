const User = require("../models/User");
const Order = require("../models/Order");
const Schedule = require("../models/Schedule");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// @desc    Lấy lịch tập theo học viên
// @route   GET /get-schedule-by-id/:memberId
// @access  Private (Trainer, Admin, Member)
exports.getSchedulesByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const schedules = await Schedule.find({ memberId })
      .select('-createdAt -updatedAt')
      .populate('memberId', 'name');
    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Lỗi lấy lịch tập theo học viên:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// @desc    Add training schedule
// @route   POST /add-schedule
// @access  Private (Trainer)
exports.trainerAddSchedule = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const { memberId, workoutType, date, timeStart, timeEnd, exercises, comment, status } = req.body;

    // Validate required fields
    if (!memberId || !workoutType || !date || !timeStart || !timeEnd || !exercises) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin: học viên, loại tập, ngày, giờ bắt đầu, giờ kết thúc và bài tập"
      });
    }

    // Check if student exists and is assigned to this trainer
    const order = await Order.findOne({ 
      trainerId,
      userId: memberId,
      // status: 'active'
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "Học viên không tồn tại hoặc không được gán cho huấn luyện viên này"
      });
    }

    // Check if member already has a schedule for this date
    const existingMemberSchedule = await Schedule.findOne({
      memberId,
      date
    });

    if (existingMemberSchedule) {
      return res.status(400).json({
        success: false,
        message: "Học viên này đã có lịch tập cho ngày này"
      });
    }

    // Check if trainer has any schedule at this time
    const existingTrainerSchedule = await Schedule.findOne({
      trainerId,
      date, 
      $or: [
        {
          timeStart: { $lt: timeEnd },
          timeEnd: { $gt: timeStart }
        }
      ]
    });

    if (existingTrainerSchedule) {
      return res.status(400).json({
        success: false,
        message: "Huấn luyện viên đã có lịch tập khác trong khoảng thời gian này"
      });
    }

    // Create new schedule
    const newSchedule = new Schedule({
      memberId,
      trainerId,
      workoutType,
      date,
      timeStart,
      timeEnd,
      exercises,
      comment,
      status: status || 'Chưa tập' 
    });

    await newSchedule.save();

    res.status(201).json({
      success: true,
      message: "Thêm lịch tập thành công",
      data: newSchedule
    });

  } catch (error) {
    console.error('Error adding schedule:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// @desc    Member tự tạo lịch tập cho bản thân
// @route   POST /add-schedule
// @access  Private (Member)
exports.memberAddSchedule = async (req, res) => {
  try {
    const memberId = req.user.id;
    const { workoutType, date, timeStart, timeEnd, exercises, comment, status } = req.body;

    if (!date || !timeStart || !timeEnd || !exercises) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng cung cấp đầy đủ thông tin: loại tập, ngày, giờ bắt đầu, giờ kết thúc và bài tập"
      });
    }

    // Kiểm tra trùng lịch cho member
    const existingMemberSchedule = await Schedule.findOne({
      memberId,
      date
    });
    if (existingMemberSchedule) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã có lịch tập cho ngày này"
      });
    }

    // Tạo lịch tập mới
    const newSchedule = new Schedule({
      memberId,
      workoutType,
      date,
      timeStart,
      timeEnd,
      exercises,
      comment,
      status: status || 'Chưa tập'
    });

    await newSchedule.save();

    res.status(201).json({
      success: true,
      message: "Tạo lịch tập thành công",
      data: newSchedule
    });

  } catch (error) {
    console.error('Error adding schedule for member:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// @desc    Cập nhật lịch tập
// @route   PUT /update-schedule/:id
// @access  Private (Trainer, Admin, Member)
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    console.log(updateData);

    const schedule = await Schedule.findByIdAndUpdate(id, updateData, { new: true })
      .select('-trainerId -createdAt -updatedAt')
      .populate('memberId', 'name');
    
    console.log(schedule);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch tập"
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật lịch tập thành công",
      data: schedule
    });
  } catch (error) {
    console.error('Lỗi cập nhật lịch tập:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// @desc    Xóa lịch tập
// @route   DELETE /delete-schedule/:id
// @access  Private (Trainer, Admin, Member)
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Deleting schedule with ID:", id);
    const result = await Schedule.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch tập"
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa lịch tập thành công"
    });
  } catch (error) {
    console.error('Lỗi xóa lịch tập:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};