const bcrypt = require("bcryptjs");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail, sendNewPasswordEmail, sendReceiptEmail, sendMaintenanceNotificationEmail } = require("../utils/emailService");

exports.register = async (req, res) => {
  try {
    const { username, name, email, password, phone, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Người dùng đã tồn tại!" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      password: hashPassword,
      phone,
      role: role || "member"
    });

    await newUser.save();
    res.status(201).json({ message: "Đăng ký thành công!", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Đăng ký thất bại!", error: err.message });
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

    const newPassword = crypto.randomBytes(10).toString('base64').slice(0, 12);
    const salt = await bcrypt.genSalt();
    const hashNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashNewPassword;
    await user.save();

    await sendNewPasswordEmail(email, newPassword);

    res.status(200).json({ message: 'Đã gửi mật khẩu mới.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi xử lý yêu cầu đặt lại mật khẩu.' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const id = req.user.id;

    const user = await User.findById(id);
    if (!user) return res.status(400).json({ message: "Người dùng không tồn tại!" });

    const salt = await bcrypt.genSalt();
    const hashNewPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashNewPassword;
    await user.save();

    res.status(200).json({ message: "Mật khẩu của bạn đã được đặt lại thành công!" });
  } catch (err) {
    res.status(500).json({ message: "Đã xảy ra lỗi khi đặt lại mật khẩu.", error: err.message });
  }
};

exports.adminAccess = (req, res) => res.status(200).json({ message: "Chào mừng Admin!" });
exports.trainerAccess = (req, res) => res.status(200).json({ message: "Chào mừng Trainer!" });
exports.staffAccess = (req, res) => res.status(200).json({ message: "Chào mừng Employee!" });
exports.memberAccess = (req, res) => res.status(200).json({ message: "Chào mừng Member!" });
