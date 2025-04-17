const { check, validationResult } = require("express-validator");

exports.registerValidation = [
  check("name", "Tên không được để trống").not().isEmpty(),
  check("email", "Email không hợp lệ").isEmail(),
  check("password", "Mật khẩu phải có ít nhất 6 ký tự").isLength({ min: 6 }),
  check("phone", "Số điện thoại không hợp lệ").isMobilePhone("vi-VN"),
  check("role", "Vai trò không hợp lệ").optional().isIn(["member", "admin", "employee", "trainer"]),
];

exports.validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};
