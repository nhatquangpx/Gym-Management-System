const User = require("../models/User");
const MembershipHistory = require("../models/MembershipHistory");
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

    const { name, email, password, phone, position, salary, shiftSchedule, performanceRating, isActive } = req.body;

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
      isActive: isActive !== undefined ? isActive : true,
      employeeInfo: {
        position,
        salary,
        shiftSchedule,
        performanceRating
      }
    });    // Save user
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
          isActive: user.isActive,
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

    const { userId, position, salary, shiftSchedule, performanceRating, isActive } = req.body;

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
    if (isActive !== undefined) user.isActive = isActive;
    user.employeeInfo = {
      position,
      salary,
      shiftSchedule,
      performanceRating
    };
    
    await user.save();    res.status(201).json({
      success: true,
      message: "Thêm nhân viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
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

    const { position, salary, shiftSchedule, performanceRating, name, email, phone, isActive } = req.body;
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
    if (isActive !== undefined) user.isActive = isActive;
    
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
    await user.save();    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin nhân viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
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

// @desc    Get all members with their active packages
// @route   GET /api/employees/members
// @access  Private (Employee)
exports.getAllMembers = async (req, res) => {
  try {
    // Lấy danh sách membership đang active
    const memberships = await MembershipHistory.find({ 
      endDate: { $gte: new Date() } 
    })
    .populate('userId', 'name') // Lấy thêm email và phone của member
    .populate('packageId', 'name') // Lấy thêm duration và price của gói tập
    .select('userId packageId'); // Thêm startDate và endDate
    // Format lại dữ liệu 
    const formattedMembers = memberships.map(membership => ({
      memberId: membership.userId._id,
      memberName: membership.userId.name,
      packageId: membership.packageId._id,
      packageName: membership.packageId.name,
    }));

    res.status(200).json({
      success: true,
      count: formattedMembers.length,
      data: formattedMembers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const Schedule = require("../models/Schedule");

// @desc    Check in for a member's workout
// @route   POST /api/employees/checkin/:memberId
// @access  Private (Employee)
exports.checkInMember = async (req, res) => {
  try {
    const { memberId } = req.params;
    // Get today's date
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    const currentTime = `${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;

    // Find schedule for today
    let schedule = await Schedule.findOne({
      memberId,
      date: todayStr,
    });
    if (schedule && schedule.status === 'Đã tập') {
      return res.status(400).json({
        success: false,
        message: "Hội viên đã checkin hôm nay rồi"
      });
    }
    if (!schedule) {
      // Create new schedule if none exists
      schedule = new Schedule({
        memberId,
        membershipId: memberId,
        date: todayStr,
        timeStart: '',
        timeEnd: '',
        status: 'Đã tập',
        checkinTime: currentTime, // Use formatted time instead of Date object
        exercises: ''
      });
    } else {
      // Update existing schedule
      schedule.status = 'Đã tập';
      schedule.checkinTime = currentTime; // Use formatted time instead of Date object
    }

    await schedule.save();

    res.status(200).json({
      success: true,
      message: "Checkin thành công",
      data: {
        scheduleId: schedule._id,
        checkinTime: schedule.checkinTime,
        status: schedule.status
      }
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