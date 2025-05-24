const User = require("../models/User");
const Order = require("../models/Order");
const Schedule = require("../models/Schedule");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// @desc    Create a new trainer
// @route   POST /api/trainers
// @access  Private (Admin)
exports.createTrainer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, specialization } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user with trainer role
    user = new User({
      name,
      email,
      password: hashPassword,
      phone,
      role: "trainer",
      trainerInfo: {
        specialization
      }
    });

    // Save user
    await user.save();

    res.status(201).json({
      success: true,
      message: "Thêm huấn luyện viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          trainerInfo: user.trainerInfo
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Create a trainer from existing user
// @route   POST /api/trainers/from-user
// @access  Private (Admin)
exports.createTrainerFromExistingUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, specialization } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Check if user is already a trainer
    if (user.role === "trainer") {
      return res.status(400).json({ message: "Người dùng này đã là huấn luyện viên" });
    }

    // Update user with trainer role
    user.role = "trainer";
    user.trainerInfo = {
      specialization
    };
    
    await user.save();

    res.status(201).json({
      success: true,
      message: "Thêm huấn luyện viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          trainerInfo: user.trainerInfo
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Update trainer information
// @route   PUT /api/trainers/:id
// @access  Private (Admin)
exports.updateTrainer = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { specialization, name, email, phone } = req.body;
    const userId = req.params.id;

    // Find user with trainer role
    const user = await User.findOne({ _id: userId, role: "trainer" });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy huấn luyện viên" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
    // Đảm bảo trainerInfo tồn tại
    if (!user.trainerInfo) {
      user.trainerInfo = {};
    }
    
    // Cập nhật thông tin trainerInfo
    if (specialization) user.trainerInfo.specialization = specialization;

    // Save updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin huấn luyện viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          trainerInfo: user.trainerInfo
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get all trainers
// @route   GET /api/trainers
// @access  Private (Admin)
exports.getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: "trainer" }).select("-password");

    res.status(200).json({
      success: true,
      count: trainers.length,
      data: trainers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get trainer by ID
// @route   GET /api/trainers/:id
// @access  Private (Admin)
exports.getTrainerById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId, role: "trainer" }).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy huấn luyện viên" });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Delete trainer
// @route   DELETE /api/trainers/:id
// @access  Private (Admin)
exports.deleteTrainer = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete user with trainer role
    const result = await User.deleteOne({ _id: userId, role: "trainer" });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy huấn luyện viên" });
    }

    res.status(200).json({
      success: true,
      message: "Xóa huấn luyện viên thành công"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get all students of a trainer
// @route   GET /api/trainers/students
// @access  Private (Admin, Trainer)
exports.getTrainerTrainees = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // Lấy tất cả các order của trainer này và chỉ lấy những order active
    const orders = await Order.find({ 
      trainerId,
      // status: 'active'
    }).select("userId");

    // Lấy danh sách userId duy nhất
    const userIds = [...new Set(orders.map(order => order.userId.toString()))];

    // Lấy thông tin học viên
    const students = await User.find({ _id: { $in: userIds } }).select("name _id");

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Add training schedule
// @route   POST /api/trainers/schedule
// @access  Private (Trainer)
exports.addSchedule = async (req, res) => {
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
      status: status || 'Chưa tham gia' 
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

// @desc    Lấy tất cả lịch tập
// @route   GET /api/trainers/get-all-schedule
// @access  Private (Admin, Trainer)
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find()
      .select('-createdAt -updatedAt')
      .populate('memberId', 'name')
      .populate('trainerId', 'name');
    res.status(200).json({
      success: true,
      count: schedules.length,
      data: schedules
    });
  } catch (error) {
    console.error('Lỗi lấy tất cả lịch tập:', error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// @desc    Lấy lịch tập theo học viên
// @route   GET /api/trainers/get-schedule-by-id/:memberId
// @access  Private (Admin, Trainer)
exports.getSchedulesByMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    const schedules = await Schedule.find({ memberId })
      .select('-createdAt -updatedAt')
      .populate('memberId', 'name')
      .populate('trainerId', 'name');
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

// @desc    Cập nhật lịch tập
// @route   PUT /api/trainers/update-schedule/:id
// @access  Private (Trainer, Admin)
exports.updateSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const schedule = await Schedule.findByIdAndUpdate(id, updateData, { new: true })
      .select('-createdAt -updatedAt')
      .populate('memberId', 'name')
      .populate('trainerId', 'name');

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
// @route   DELETE /api/trainers/delete-schedule/:id
// @access  Private (Trainer, Admin)
exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
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