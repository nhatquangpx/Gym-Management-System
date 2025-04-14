const { check } = require("express-validator");

// Validation for creating a new member
exports.createMemberValidation = [
  check("name", "Tên không được để trống").not().isEmpty(),
  check("email", "Email không hợp lệ").isEmail(),
  check("password", "Mật khẩu phải có ít nhất 6 ký tự").isLength({ min: 6 }),
  check("phone", "Số điện thoại không hợp lệ").optional().isMobilePhone("vi-VN"),
  check("gender", "Giới tính không hợp lệ").optional().isIn(["Nam", "Nữ", "Khác"]),
  check("dateOfBirth", "Ngày sinh không hợp lệ").optional().isISO8601(),
  check("job", "Nghề nghiệp không được để trống").optional().not().isEmpty(),
  check("address", "Địa chỉ không được để trống").optional().not().isEmpty(),
  check("membershipEnd", "Ngày kết thúc thành viên không hợp lệ").isISO8601()
];

// Validation for creating a member from existing user
exports.createMemberFromUserValidation = [
  check("userId", "ID người dùng không hợp lệ").isMongoId(),
  check("gender", "Giới tính không hợp lệ").optional().isIn(["Nam", "Nữ", "Khác"]),
  check("dateOfBirth", "Ngày sinh không hợp lệ").optional().isISO8601(),
  check("job", "Nghề nghiệp không được để trống").optional().not().isEmpty(),
  check("address", "Địa chỉ không được để trống").optional().not().isEmpty(),
  check("membershipEnd", "Ngày kết thúc thành viên không hợp lệ").isISO8601()
];

// Validation for updating a member
exports.updateMemberValidation = [
  check("gender", "Giới tính không hợp lệ").optional().isIn(["Nam", "Nữ", "Khác"]),
  check("dateOfBirth", "Ngày sinh không hợp lệ").optional().isISO8601(),
  check("job", "Nghề nghiệp không được để trống").optional().not().isEmpty(),
  check("address", "Địa chỉ không được để trống").optional().not().isEmpty(),
  check("membershipEnd", "Ngày kết thúc thành viên không hợp lệ").optional().isISO8601()
]; 