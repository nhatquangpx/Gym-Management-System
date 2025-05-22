const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private (Admin)
exports.createEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, position, salary, shiftSchedule, performanceRating } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user with employee role
    user = new User({
      name,
      email,
      password: hashPassword,
      phone,
      role: "employee",
      employeeInfo: {
        position,
        salary,
        shiftSchedule,
        performanceRating
      }
    });

    // Save user
    await user.save();

    res.status(201).json({
      success: true,
      message: "Thêm nhân viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          employeeInfo: user.employeeInfo
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Create an employee from existing user
// @route   POST /api/employees/from-user
// @access  Private (Admin)
exports.createEmployeeFromExistingUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, position, salary, shiftSchedule, performanceRating } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Check if user is already an employee
    if (user.role === "employee") {
      return res.status(400).json({ message: "Người dùng này đã là nhân viên" });
    }

    // Update user with employee role
    user.role = "employee";
    user.employeeInfo = {
      position,
      salary,
      shiftSchedule,
      performanceRating
    };
    
    await user.save();

    res.status(201).json({
      success: true,
      message: "Thêm nhân viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          employeeInfo: user.employeeInfo
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Update employee information
// @route   PUT /api/employees/:id
// @access  Private (Admin)
exports.updateEmployee = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { position, salary, shiftSchedule, performanceRating, name, email, phone } = req.body;
    const userId = req.params.id;

    // Find user with employee role
    const user = await User.findOne({ _id: userId, role: "employee" });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
    // Update employeeInfo fields
    if (position || salary || shiftSchedule || performanceRating) {
      user.employeeInfo = {
        ...user.employeeInfo,
        ...(position && { position }),
        ...(salary && { salary }),
        ...(shiftSchedule && { shiftSchedule }),
        ...(performanceRating && { performanceRating })
      };
    }

    // Save updated user
    await user.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin nhân viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          employeeInfo: user.employeeInfo
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (Admin)
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" }).select("-password");

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get employee by ID
// @route   GET /api/employees/:id
// @access  Private (Admin)
exports.getEmployeeById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId, role: "employee" }).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
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

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private (Admin)
exports.deleteEmployee = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete user with employee role
    const result = await User.deleteOne({ _id: userId, role: "employee" });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    }

    res.status(200).json({
      success: true,
      message: "Xóa nhân viên thành công"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
