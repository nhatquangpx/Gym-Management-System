const User = require("../models/User");
const TrainerFeedback = require('../models/TrainerFeedback');
const MembershipHistory = require("../models/MembershipHistory");
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

// @desc    Get all students of all trainers
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
exports.getTrainerStudents = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // Get active memberships
    const memberships = await MembershipHistory.find({ 
      trainerId,
    }).populate('userId', 'name email phone')
      .populate('packageId', 'name');
    // Calculate progress for each student
    const formattedStudents = await Promise.all(memberships.map(async (membership) => {
      const startDate = new Date(membership.startDate);
      const endDate = new Date(membership.endDate);
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Get completed workouts count
      const completedWorkouts = await Schedule.countDocuments({
        memberId: membership.userId._id,
        status: 'Đã tập',
        date: {
          $gte: membership.startDate,
          $lte: membership.endDate
        }
      });
      // Calculate progress percentage
      const progress = Math.min(
        Math.round((completedWorkouts / totalDays) * 100),
        100
      );
      let status = '';
      if( new Date() > new Date(membership.endDate) ) {
        status = 'Hết hạn';
      } else if (new Date() < new Date(membership.startDate)) {
        status = 'Chưa bắt đầu';
      } else {
        status = 'Đang hoạt động';
      }
      console.log(membership.packageId.name)
      return {
        _id: membership.userId._id,
        name: membership.userId.name,
        email: membership.userId.email,
        phone: membership.userId.phone,
        membershipStart: membership.startDate,
        membershipEnd: membership.endDate,
        progress,
        packageName: membership.packageId.name,
        packageId: membership.packageId._id,
        goal: 'Giảm cân',
        status: status
      };
    }));

    res.status(200).json({
      success: true,
      count: formattedStudents.length,
      data: formattedStudents
    });
  } catch (error) {
    console.error(error);
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
    const trainerId = req.user.id;

    // Get all members managed by this trainer
    const memberships = await MembershipHistory.find({ trainerId })
      .select('userId');

    const memberIds = memberships.map(m => m.userId);

    // Get all schedules for these members, including self-created ones
    const schedules = await Schedule.find({
      memberId: { $in: memberIds }
    })
      .populate('memberId', 'name _id')
      .select('timeStart timeEnd memberId exercises date status comment');

    // Add package information to each schedule
    const scheduleWithPackages = await Promise.all(schedules.map(async (schedule) => {
      let memberId = schedule.memberId?._id.toString();
      
      const membership = await MembershipHistory.findOne({
        userId: memberId,
        trainerId
      }).populate('packageId', 'name');

      return {
        id: schedule._id.toString(),
        timeStart: schedule.timeStart,
        timeEnd: schedule.timeEnd,
        memberId: memberId,
        memberName: schedule.memberId?.name,
        exercises: schedule.exercises,
        date: schedule.date,
        status: schedule.status,
        comment: schedule.comment || '',
        packageName: membership?.packageId?.name || 'Chưa có gói tập',
        isTrainerSchedule: schedule.trainerId ? true : false // Check if schedule was created by trainer
      };
    }));

    res.status(200).json({
      success: true,
      data: scheduleWithPackages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server", 
      error: error.message 
    });
  }
};

// @desc    Get dashboard stats for trainer
// @route   GET /api/trainers/dashboard-stats
// @access  Private (Trainer)
exports.getTrainerDashboardStats = async (req, res) => {
  try {
    const trainerId = req.user.id;
    // Tổng số học viên
    const memberships = await MembershipHistory.find({ trainerId }).select("userId");
    const userIds = [...new Set(memberships.map(membership => membership.userId.toString()))];
    const totalStudents = userIds.length;

    // Lấy ngày hôm nay (YYYY-MM-DD)
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const currentTime = today.getHours().toString().padStart(2, '0') + ':' + 
                       today.getMinutes().toString().padStart(2, '0');

    // Lấy tất cả lịch tập của trainer hôm nay
    const todaySchedules = await Schedule.find({
      trainerId,
      date: todayStr
    });

    // Tổng số buổi tập hôm nay
    const todaySessions = todaySchedules.length;

    // Đã hoàn thành (status: 'Đã tập')
    const completedSessions = todaySchedules.filter(s => s.status === 'Đã tập').length;

    // Sắp tới (status: khác 'Đã tập', ví dụ 'Chưa tập')
        const upcomingSessions = todaySchedules.filter(s => s.timeStart >= currentTime).length;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        todaySessions,
        completedSessions,
        upcomingSessions
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get today's schedule for trainer
// @route   GET /api/trainers/today-schedule
// @access  Private (Trainer)
exports.getTodaySchedule = async (req, res) => {
  try {
    const trainerId = req.user.id;
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    // Lấy lịch tập hôm nay của trainer, populate tên học viên
    const studentIds = await MembershipHistory.find({ trainerId })
      .select('userId');
    console.log(studentIds);
    const schedules = await Schedule.find({
      date: todayStr,
      memberId: { $in: studentIds.map(m => m.userId) }
    })
      .populate('memberId', 'name')
      .select('timeStart timeEnd memberId workoutType');
    console.log(schedules);
    // Định dạng lại dữ liệu cho FE
    const data = schedules.map(s => ({
      id: s._id,
      time: `${s.timeStart} - ${s.timeEnd}`,
      student: s.memberId?.name || '',
      type: s.workoutType || ''
    }));

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get student progress for trainer
// @route   GET /api/trainers/student-progress
// @access  Private (Trainer)
exports.getStudentProgress = async (req, res) => {
  try {
    const trainerId = req.user.id;

    // Get active memberships and their packages
    const memberships = await MembershipHistory.find({ 
      trainerId, 
      endDate: { $gte: new Date() } 
    })
    .populate('userId', 'name');
    const studentsProgress = await Promise.all(memberships.map(async (membership) => {
      const startDate = new Date(membership.startDate);
      const endDate = new Date(membership.endDate);
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

      // Get completed workouts count since membership start
      const completedWorkouts = await Schedule.countDocuments({
        memberId: membership.userId._id,
        status: 'Đã tập',
        date: {
          $gte: membership.startDate,
          $lte: membership.endDate
        }
      });

      // Calculate progress percentage
      const progress = Math.min(
        Math.round((completedWorkouts / totalDays) * 100),
        100
      );

      return {
        name: membership.userId.name,
        progress: progress,
        goal: `Giảm cân`
      };
    }));

    res.status(200).json({
      success: true,
      data: studentsProgress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server", 
      error: error.message 
    });
  }
};

// @desc    Ghi nhận buổi tập (cập nhật status và comment cho schedule)
// @route   PUT /api/trainers/log-workout/:id
// @access  Private (Trainer)
exports.logWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;

    // Tìm lịch tập theo id
    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy lịch tập"
      });
    }
    if (schedule.comment) {
      return res.status(400).json({
        success: false,
        message: "Buổi tập đã được ghi nhận trước đó"
      });
    }
    // Cập nhật comment
    if (comment !== undefined) schedule.comment = comment;
    if (schedule.status !== 'Đã tập') {
      schedule.status = 'Đã tập'; // Chỉ cập nhật status nếu chưa ghi nhận
    }

    await schedule.save();

    res.status(200).json({
      success: true,
      message: "Ghi nhận buổi tập thành công",
      data: schedule
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// @desc    Add feedback for student
// @route   POST /api/trainers/feedback
// @access  Private (Trainer)
exports.addFeedback = async (req, res) => {
  try {
    const { memberId, packageId, content } = req.body;
    const trainerId = req.user.id;
    const date = new Date().toISOString().slice(0, 10); // Format YYYY-MM-DD
    // Create new feedback
    const feedback = new TrainerFeedback({
      trainerId,
      memberId,
      packageId,
      content,
      date
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Thêm nhận xét thành công",
      data: feedback
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// @desc    Get feedback history for a student
// @route   GET /api/trainers/feedback/:memberId
// @access  Private (Trainer)
exports.getFeedbackHistory = async (req, res) => {
  try {
    const { memberId } = req.params;
    const trainerId = req.user.id;

    let query = { trainerId, memberId };

    const feedbacks = await TrainerFeedback.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};

// @desc    Get trainers by type (yoga or gym)
// @route   GET /api/trainers/by-type/:type
// @access  Public
exports.getTrainersByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Kiểm tra type có hợp lệ không
    if (type !== 'yoga' && type !== 'gym') {
      return res.status(400).json({ 
        success: false,
        message: "Loại huấn luyện viên không hợp lệ, chỉ chấp nhận 'yoga' hoặc 'gym'" 
      });
    }
    
    // Tìm các huấn luyện viên có trainerInfo.type phù hợp
    const trainers = await User.find({ 
      role: "trainer", 
      "trainerInfo.type": type
    })
    .select("-password")
    .lean();
    
    // Định dạng dữ liệu trả về để phù hợp với giao diện
    const formattedTrainers = trainers.map(trainer => ({
      id: trainer._id,
      name: trainer.name,
      specialty: trainer.trainerInfo?.specialization || 'Chung',
      experience: '5 năm kinh nghiệm', // Giá trị mặc định, nếu có thể bổ sung trường này vào model
      rating: 4.5, // Giá trị mặc định, có thể tính toán từ model Feedback
      image: trainer.trainerInfo?.image || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80' // Ảnh mặc định
    }));

    res.status(200).json({
      success: true,
      count: formattedTrainers.length,
      data: formattedTrainers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: "Lỗi server khi lấy danh sách huấn luyện viên", 
      error: error.message 
    });
  }
};