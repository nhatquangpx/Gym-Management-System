const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

exports.adminAccess = (req, res) => res.status(200).json({ message: "Chào mừng Admin!" });
exports.trainerAccess = (req, res) => res.status(200).json({ message: "Chào mừng Trainer!" });
exports.staffAccess = (req, res) => res.status(200).json({ message: "Chào mừng Employee!" });
exports.memberAccess = (req, res) => res.status(200).json({ message: "Chào mừng Member!" });
