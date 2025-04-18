const Member = require("../models/Member");
const User = require("../models/User");
const { validationResult } = require("express-validator");

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

    // Create new user with member role
    user = new User({
      name,
      email,
      password,
      phone,
      role: "member"
    });

    // Save user
    await user.save();

    // Create new member
    const member = new Member({
      userId: user._id,
      gender,
      dateOfBirth,
      job,
      address,
      membershipStart: Date.now(),
      membershipEnd
    });

    // Save member
    await member.save();

    res.status(201).json({
      success: true,
      message: "Thêm hội viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        member: {
          _id: member._id,
          gender: member.gender,
          dateOfBirth: member.dateOfBirth,
          job: member.job,
          address: member.address,
          membershipStart: member.membershipStart,
          membershipEnd: member.membershipEnd
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
    }

    // Check if user is already a member
    const existingMember = await Member.findOne({ userId });
    if (existingMember) {
      return res.status(400).json({ message: "Người dùng này đã là hội viên" });
    }

    // Create new member
    const member = new Member({
      userId,
      gender,
      dateOfBirth,
      job,
      address,
      membershipStart: Date.now(),
      membershipEnd
    });

    // Save member
    await member.save();

    // Update user role to member if not already
    if (user.role !== "member") {
      user.role = "member";
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Thêm hội viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        },
        member: {
          _id: member._id,
          gender: member.gender,
          dateOfBirth: member.dateOfBirth,
          job: member.job,
          address: member.address,
          membershipStart: member.membershipStart,
          membershipEnd: member.membershipEnd
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
    }

    const { gender, dateOfBirth, job, address, membershipEnd } = req.body;
    const memberId = req.params.id;

    // Find member
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }

    // Update member
    member.gender = gender || member.gender;
    member.dateOfBirth = dateOfBirth || member.dateOfBirth;
    member.job = job || member.job;
    member.address = address || member.address;
    member.membershipEnd = membershipEnd || member.membershipEnd;

    // Save updated member
    await member.save();

    // Get user information
    const user = await User.findById(member.userId).select("-password");

    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin hội viên thành công",
      data: {
        user,
        member
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
    const members = await Member.find().populate({
      path: "userId",
      select: "name email phone role",
      model: "User"
    });

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
    const memberId = req.params.id;

    const member = await Member.findById(memberId).populate({
      path: "userId",
      select: "name email phone role",
      model: "User"
    });

    if (!member) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }

    res.status(200).json({
      success: true,
      data: member
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
    const memberId = req.params.id;

    // Find member
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }

    // Delete user associated with member
    await User.findByIdAndDelete(member.userId);

    // Delete member
    await Member.findByIdAndDelete(memberId);

    res.status(200).json({
      success: true,
      message: "Xóa hội viên thành công"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}; 