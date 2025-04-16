const {check} = require("express-validator");

exports.createPackageValidation = [
    check("name", "Tên gói không được để trống").not().isEmpty(),
    check("description", "Mô tả không được để trống").not().isEmpty(),
    check("package_type", "Loại gói không hợp lệ").isIn(["MONTHLY", "SESSION", "VIP", "PRIVATE"]),
    check("duration_in_days", "Thời gian không hợp lệ").optional().isNumeric(),
    check("number_of_sessions", "Số buổi không hợp lệ").optional().isNumeric(),
    check("price", "Giá không hợp lệ").isNumeric(),
    check("discount", "Giảm giá không hợp lệ").optional().isNumeric(),
    check("status", "Trạng thái không hợp lệ").optional().isIn(["active", "inactive"]),
]

exports.updatePackageValidation = [
    check("name", "Tên gói không được để trống").optional().not().isEmpty(),
    check("description", "Mô tả không được để trống").optional().not().isEmpty(),
    check("package_type", "Loại gói không hợp lệ").optional().isIn(["MONTHLY", "SESSION", "VIP", "PRIVATE"]),
    check("duration_in_days", "Thời gian không hợp lệ").optional().isNumeric(),
    check("number_of_sessions", "Số buổi không hợp lệ").optional().isNumeric(),
    check("price", "Giá không hợp lệ").optional().isNumeric(),
    check("discount", "Giảm giá không hợp lệ").optional().isNumeric(),
    check("status", "Trạng thái không hợp lệ").optional().isIn(["active", "inactive"]),
]

