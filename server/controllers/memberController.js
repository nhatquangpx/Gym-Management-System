const User = require("../models/User");
const Order = require("../models/Order");
const Package = require("../models/Package");
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
      memberInfo: {
        gender,
        dateOfBirth,
        job,
        address,
        membershipStart: Date.now(),
        membershipEnd
      }
    });
    
    // Save user
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
          memberInfo: {
            gender: user.memberInfo.gender,
            dateOfBirth: user.memberInfo.dateOfBirth,
            job: user.memberInfo.job,
            address: user.memberInfo.address,
            membershipStart: user.memberInfo.membershipStart,
            membershipEnd: user.memberInfo.membershipEnd
          }
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
    if (user.role === "member") {
      return res.status(400).json({ message: "Người dùng này đã là hội viên" });
    }

    // Update user with member role and member fields
    user.role = "member";
    
    // Tạo hoặc cập nhật memberInfo
    if (!user.memberInfo) {
      user.memberInfo = {};
    }
    
    user.memberInfo.gender = gender;
    user.memberInfo.dateOfBirth = dateOfBirth;
    user.memberInfo.job = job;
    user.memberInfo.address = address;
    user.memberInfo.membershipStart = Date.now();
    user.memberInfo.membershipEnd = membershipEnd;
    
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
          memberInfo: {
            gender: user.memberInfo.gender,
            dateOfBirth: user.memberInfo.dateOfBirth,
            job: user.memberInfo.job,
            address: user.memberInfo.address,
            membershipStart: user.memberInfo.membershipStart,
            membershipEnd: user.memberInfo.membershipEnd
          }
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
    
    const { gender, dateOfBirth, job, address, membershipEnd, name, email, phone } = req.body;
    const userId = req.params.id;
    console.log(dateOfBirth);
    // Find user with member role
    const user = await User.findOne({ _id: userId, role: "member" });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }

    // Update user fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    
    // Đảm bảo memberInfo tồn tại
    if (!user.memberInfo) {
      user.memberInfo = {};
    }
    
    // Cập nhật thông tin memberInfo
    if (gender) user.memberInfo.gender = gender;
    if (dateOfBirth) user.memberInfo.dateOfBirth = dateOfBirth;
    if (job) user.memberInfo.job = job;
    if (address) user.memberInfo.address = address;
    if (membershipEnd) user.memberInfo.membershipEnd = membershipEnd;

    // Save updated user
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Cập nhật thông tin hội viên thành công",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          memberInfo: {
            gender: user.memberInfo.gender,
            dateOfBirth: user.memberInfo.dateOfBirth,
            job: user.memberInfo.job,
            address: user.memberInfo.address,
            membershipStart: user.memberInfo.membershipStart,
            membershipEnd: user.memberInfo.membershipEnd
          }
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

// @desc    Get member's current package status
// @route   GET /api/members/:id/package-status
// @access  Private (Admin)
// @note    This function handles package registration for existing members.
//          For new user registration with package, see registrationController.js
exports.getPackageStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user
    const user = await User.findOne({ _id: userId, role: "member" });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }

    // Debug log to see user structure
    console.log("User data:", JSON.stringify(user, null, 2));
    console.log("memberInfo:", user.memberInfo);
    console.log("membershipStart:", user.memberInfo ? user.memberInfo.membershipStart : null);
    console.log("membershipEnd:", user.memberInfo ? user.memberInfo.membershipEnd : null);

    // Check if the user has an active membership
    const now = new Date();
    const isActive = user.memberInfo && 
                    user.memberInfo.membershipEnd && 
                    new Date(user.memberInfo.membershipEnd) > now;

    // Find the latest paid order for this user to determine the current package type
    const latestOrder = await Order.findOne({ 
      userId: userId, 
      status: 'paid' 
    })
    .sort({ createdAt: -1 })
    .populate('packageId');

    // Get available packages for renewal (same type as current package)
    let availablePackages = [];
    if (latestOrder && latestOrder.packageId) {
      const currentPackageType = latestOrder.packageId.type;
      
      availablePackages = await Package.find({
        type: currentPackageType,
        _id: { $ne: latestOrder.packageId._id }
      });
    }

    // Get all available packages for new registration
    const allPackages = await Package.find();

    // Create a safe copy of user data for debugging
    const userDataForDebug = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      memberInfo: user.memberInfo ? {
        gender: user.memberInfo.gender,
        dateOfBirth: user.memberInfo.dateOfBirth,
        job: user.memberInfo.job,
        address: user.memberInfo.address,
        membershipStart: user.memberInfo.membershipStart,
        membershipEnd: user.memberInfo.membershipEnd
      } : null
    };

    res.status(200).json({
      success: true,
      data: {
        membershipActive: isActive,
        membershipStart: user.memberInfo ? user.memberInfo.membershipStart : null,
        membershipEnd: user.memberInfo ? user.memberInfo.membershipEnd : null,
        currentPackage: latestOrder ? latestOrder.packageId : null,
        availablePackages, // Packages of same type for renewal
        allPackages, // All packages for new registration
        canRenew: !!latestOrder,
        canRegisterNew: !isActive,
        // Debug data
        userDebug: userDataForDebug
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Cancel current package
// @route   POST /api/members/:id/cancel-package
// @access  Private (Admin)
exports.cancelPackage = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user
    const user = await User.findOne({ _id: userId, role: "member" });
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }

    // Check if user has an active membership
    const now = new Date();
    const isActive = user.memberInfo && 
                    user.memberInfo.membershipEnd && 
                    new Date(user.memberInfo.membershipEnd) > now;

    if (!isActive) {
      return res.status(400).json({ message: "Hội viên không có gói tập đang hoạt động để hủy" });
    }

    // Update membership end date to now (effectively canceling the active membership)
    if (!user.memberInfo) user.memberInfo = {};
    user.memberInfo.membershipEnd = now;
    await user.save();

    // Create a cancellation record (optional, for tracking purposes)
    // This could be implemented as a separate model or as a note in the user's record

    res.status(200).json({
      success: true,
      message: "Hủy gói tập thành công",
      data: {
        membershipEnd: user.memberInfo.membershipEnd
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Register new package
// @route   POST /api/members/:id/register-package
// @access  Private (Admin)
// @note    This function handles package registration for existing members.
//          For new user registration with package, see registrationController.js
exports.registerPackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { packageId, paymentMethod, amount } = req.body;
    const userId = req.params.id;

    // Find user and package
    const [user, packageData] = await Promise.all([
      User.findOne({ _id: userId, role: "member" }),
      Package.findById(packageId)
    ]);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }
    if (!packageData) {
      return res.status(404).json({ message: "Không tìm thấy gói tập" });
    }

    // Check if user has an active membership
    const now = new Date();
    const isActive = user.memberInfo && 
                    user.memberInfo.membershipEnd && 
                    new Date(user.memberInfo.membershipEnd) > now;

    if (isActive) {
      return res.status(400).json({ 
        message: "Hội viên đang có gói tập đang hoạt động. Vui lòng hủy gói tập hiện tại trước khi đăng ký gói mới" 
      });
    }

    // Create a new order
    const order = new Order({
      userId: userId,
      packageId: packageId,
      amount: amount || packageData.price,
      orderType: paymentMethod === 'banking' ? 'bank_transfer' : (paymentMethod === 'momo' ? 'momo' : 'cash'),
      status: "paid", // Assuming immediate payment for admin-created orders
      vnp_OrderInfo: `Đăng ký gói tập ${packageData.name}`
    });

    await order.save();

    // Calculate new membership end date
    const membershipStart = new Date();
    const membershipEnd = new Date(membershipStart);
    membershipEnd.setMonth(membershipEnd.getMonth() + packageData.duration);

    // Update user membership
    if (!user.memberInfo) user.memberInfo = {};
    user.memberInfo.membershipStart = membershipStart;
    user.memberInfo.membershipEnd = membershipEnd;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Đăng ký gói tập thành công",
      data: {
        order: order,
        membershipStart: user.memberInfo.membershipStart,
        membershipEnd: user.memberInfo.membershipEnd
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

// @desc    Renew package
// @route   POST /api/members/:id/renew-package
// @access  Private (Admin)
exports.renewPackage = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { packageId, paymentMethod, amount } = req.body;
    const userId = req.params.id;

    // Find user and package
    const [user, packageData] = await Promise.all([
      User.findOne({ _id: userId, role: "member" }),
      Package.findById(packageId)
    ]);

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy hội viên" });
    }
    if (!packageData) {
      return res.status(404).json({ message: "Không tìm thấy gói tập" });
    }

    // Find the latest paid order for this user to determine the current package type
    const latestOrder = await Order.findOne({ 
      userId: userId, 
      status: 'paid' 
    })
    .sort({ createdAt: -1 })
    .populate('packageId');

    // Check if package type matches the last order's package type
    if (latestOrder && latestOrder.packageId && latestOrder.packageId.type !== packageData.type) {
      // Check if membership is active
      const now = new Date();
      const isActive = user.memberInfo && 
                      user.memberInfo.membershipEnd && 
                      new Date(user.memberInfo.membershipEnd) > now;
                      
      if (isActive) {
        return res.status(400).json({ 
          message: "Chỉ có thể gia hạn gói tập cùng loại. Vui lòng hủy gói tập hiện tại để đăng ký gói mới" 
        });
      }
    }

    // Create a new order for renewal
    const order = new Order({
      userId: userId,
      packageId: packageId,
      amount: amount || packageData.price,
      orderType: paymentMethod === 'banking' ? 'bank_transfer' : (paymentMethod === 'momo' ? 'momo' : 'cash'),
      status: "paid", // Assuming immediate payment for admin-created orders
      vnp_OrderInfo: `Gia hạn gói tập ${packageData.name}`
    });

    await order.save();

    // Calculate new membership end date
    const now = new Date();
    const currentEndDate = user.memberInfo && user.memberInfo.membershipEnd ? 
                          new Date(user.memberInfo.membershipEnd) : now;
    
    // If current membership is still active, add duration to current end date
    // Otherwise, start from now
    const startDate = currentEndDate > now ? currentEndDate : now;
    const membershipEnd = new Date(startDate);
    membershipEnd.setMonth(membershipEnd.getMonth() + packageData.duration);

    // Update user membership
    if (!user.memberInfo) user.memberInfo = {};
    if (currentEndDate <= now) {
      user.memberInfo.membershipStart = now; // Reset start date if previous membership expired
    }
    user.memberInfo.membershipEnd = membershipEnd;
    
    await user.save();

    res.status(200).json({
      success: true,
      message: "Gia hạn gói tập thành công",
      data: {
        order: order,
        membershipStart: user.memberInfo.membershipStart,
        membershipEnd: user.memberInfo.membershipEnd
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
}; 