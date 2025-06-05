const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail, sendNewPasswordEmail, sendReceiptEmail, sendMaintenanceNotificationEmail } = require("../utils/emailService");

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }
    const newUser = new User({ name, email, password, phone, role });
    await newUser.save();
    res.status(200).json({ message: "Đăng ký thành công!", newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.checkExistedEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email là bắt buộc" 
      });
    }

    const existingUser = await User.findOne({ email });
    return res.status(200).json({ 
      success: true,
      exists: !!existingUser,
      message: existingUser ? "Email đã tồn tại" : "Email có thể sử dụng"
    });
  } catch (err) {
    console.error('Error checking email:', err);
    res.status(500).json({ 
      success: false,
      message: "Đã xảy ra lỗi khi kiểm tra email", 
      error: err.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Người dùng không tồn tại!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mật khẩu không chính xác!" });

    const token = jwt.sign({ id: user._id, role: user.role, session: Date.now }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Email không tồn tại.' });
    }

    const newPassword = crypto.randomBytes(20).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
    const salt = await bcrypt.genSalt();
    const hashNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashNewPassword;
    await user.save();

    await sendNewPasswordEmail(email, newPassword);

    res.status(200).json({
      success: true,
      message: 'Đã gửi mật khẩu mới.'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu đặt lại mật khẩu.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const id = req.user.id;

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu mới không khớp!" 
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ 
        success: false,
        message: "Người dùng không tồn tại!" 
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false,
        message: "Mật khẩu hiện tại không chính xác!" 
      });
    }

    const salt = await bcrypt.genSalt();
    const hashNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashNewPassword;
    await user.save();

    res.status(200).json({ 
      success: true,
      message: "Đổi mật khẩu thành công!" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Đã xảy ra lỗi khi đổi mật khẩu.",
      error: err.message 
    });
  }
};

exports.adminAccess = (req, res) => res.status(200).json({ message: "Chào mừng Admin!" });
exports.trainerAccess = (req, res) => res.status(200).json({ message: "Chào mừng Trainer!" });
exports.staffAccess = (req, res) => res.status(200).json({ message: "Chào mừng Employee!" });
exports.memberAccess = (req, res) => res.status(200).json({ message: "Chào mừng Member!" });
