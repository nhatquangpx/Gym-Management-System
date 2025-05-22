const User = require("../models/User");
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
