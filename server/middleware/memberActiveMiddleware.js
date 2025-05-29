const User = require("../models/User");

const verifyActiveMember = async (req, res, next) => {
  try {
    // Lấy thông tin user
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(403).json({
        success: false,
        message: "Không tìm thấy tài khoản"
      });
    }
    // Kiểm tra membershipEnd còn hiệu lực không
    if (!user.memberInfo.membershipEnd || new Date(user.memberInfo.membershipEnd) < new Date()) {
      return res.status(403).json({
        success: false,
        message: "Gói tập của bạn đã hết hạn"
      });
    }
    // req.user = {
    //     ...decoded,
    //     membershipEnd: user.memberInfo.membershipEnd
    // };

    // Nếu hợp lệ
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi xác thực member",
      error: error.message
    });
  }
};

module.exports = verifyActiveMember;