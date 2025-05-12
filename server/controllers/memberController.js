const User = require("../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

// @desc    Create a new member
// @route   POST /api/members
// @access  Private (Admin)
exports.createMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, gender, dateOfBirth, job, address, membershipEnd } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user with member role and member fields
    user = new User({
      name,
      email,
      password: hashPassword,
      phone,
      role: "member",
      gender,
      dateOfBirth,
      job,      address,
      membershipStart: Date.now(),
      membershipEnd
    });    // Save user
    await user.save();

    res.status(201).json({
      success: true,
      message: "Thêm hội viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          job: user.job,
          address: user.address,
          membershipStart: user.membershipStart,
          membershipEnd: user.membershipEnd
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Create a new member from existing user
// @route   POST /api/members/from-user
// @access  Private (Admin)
exports.createMemberFromExistingUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId, gender, dateOfBirth, job, address, membershipEnd } = req.body;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }    // Check if user is already a member
    if (user.role === "member") {
      return res.status(400).json({ message: "Người dùng này đã là hội viên" });
    }

    // Update user with member role and member fields
    user.role = "member";
    user.gender = gender;
    user.dateOfBirth = dateOfBirth;
    user.job = job;
    user.address = address;
    user.membershipStart = Date.now();
    user.membershipEnd = membershipEnd;
    
    await user.save();    res.status(201).json({
      success: true,
      message: "Thêm hội viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          job: user.job,
          address: user.address,
          membershipStart: user.membershipStart,
          membershipEnd: user.membershipEnd
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Update member information
// @route   PUT /api/members/:id
// @access  Private (Admin)
exports.updateMember = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }    const { gender, dateOfBirth, job, address, membershipEnd, name, email, phone } = req.body;
    const userId = req.params.id;

    // Find user with member role
    const user = await User.findOne({ _id: userId, role: "member" });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (gender) user.gender = gender;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (job) user.job = job;
    if (address) user.address = address;
    if (membershipEnd) user.membershipEnd = membershipEnd;

    // Save updated user
    await user.save();    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin hội viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          job: user.job,
          address: user.address,
          membershipStart: user.membershipStart,
          membershipEnd: user.membershipEnd
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get all members
// @route   GET /api/members
// @access  Private (Admin)
exports.getAllMembers = async (req, res) => {
  try {
    const members = await User.find({ role: "member" }).select("-password");

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Get member by ID
// @route   GET /api/members/:id
// @access  Private (Admin)
exports.getMemberById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId, role: "member" }).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
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

// @desc    Delete member
// @route   DELETE /api/members/:id
// @access  Private (Admin)
exports.deleteMember = async (req, res) => {
  try {
    const userId = req.params.id;

    // Find and delete user with member role
    const result = await User.deleteOne({ _id: userId, role: "member" });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }

    res.status(200).json({
      success: true,
      message: "Xóa hội viên thành công"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}; 