const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../../models/User");

/**
 * Tạo một user test với role và thông tin cụ thể
 */
const createTestUser = async (userData = {}) => {
  try {
    // Tạo email ngẫu nhiên để tránh trùng lặp nếu không được chỉ định
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const randomEmail = `test${timestamp}${randomNum}@example.com`;
    
    const defaultUserData = {
      name: "Test User",
      email: randomEmail, // Sử dụng email ngẫu nhiên làm mặc định
      password: "password123", // Đảm bảo đủ dài theo schema (minlength: 6)
      phone: "0123456789",
      role: "member",
      isActive: true,
    };

    // Kiểm tra kết nối cơ sở dữ liệu
    if (mongoose.connection.readyState !== 1) {
      throw new Error("MongoDB connection is not ready - please check setup.js");
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(
      userData.password || defaultUserData.password,
      10
    );

    // Dữ liệu người dùng cuối cùng
    const finalUserData = {
      ...defaultUserData,
      ...userData, // userData ghi đè defaultUserData
    };

    // Đặt mật khẩu đã hash
    finalUserData.password = hashedPassword;
    
    // Tạo model User mới
    const user = new User(finalUserData);
    
    // Thực hiện kiểm tra hợp lệ
    const validationErrors = user.validateSync();
    if (validationErrors) {
      throw new Error(`Validation failed: ${JSON.stringify(validationErrors)}`);
    }
    
    // Lưu vào cơ sở dữ liệu
    const savedUser = await user.save();
    
    // Kiểm tra xem người dùng có được lưu không bằng cách tìm lại
    const verifyUser = await User.findById(savedUser._id);
    if (!verifyUser) {
      throw new Error("User was saved but could not be retrieved");
    }
    
    return savedUser;
  } catch (error) {
    
    // Xử lý lỗi trùng lặp (duplicate key)
    if (error.code === 11000) {
      if (!userData.email) {
        return createTestUser(userData); // Gọi lại hàm để thử với email ngẫu nhiên khác
      }
    }
    
    throw error; // Re-throw để test thất bại rõ ràng
  }
};

/**
 * Tạo JWT token cho test user
 */
const generateTestToken = (userId, role = "member") => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET || "test-secret", {
    expiresIn: "1h",
  });
};

/**
 * Tạo admin user cho testing
 */
const createTestAdmin = async () => {
  return await createTestUser({
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  });
};

/**
 * Tạo trainer user cho testing
 */
const createTestTrainer = async () => {
  return await createTestUser({
    name: "Trainer User",
    email: "trainer@example.com",
    role: "trainer",
    trainerInfo: {
      specialization: "Fitness Training",
      type: "gym",
    },
  });
};

/**
 * Tạo employee user cho testing
 */
const createTestEmployee = async () => {
  return await createTestUser({
    name: "Employee User",
    email: "employee@example.com",
    role: "employee",
  });
};

/**
 * Tạo member user cho testing
 */
const createTestMember = async () => {
  return await createTestUser({
    name: "Member User",
    email: "member@example.com",
    role: "member",
    memberInfo: {
      gender: "male",
      dateOfBirth: new Date("1990-01-01"),
      job: "Software Developer",
      address: "123 Test Street",
    },
  });
};

/**
 * Xóa tất cả test data
 */
const clearTestData = async () => {
  try {
    const result = await User.deleteMany({});
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTestUser,
  generateTestToken,
  createTestAdmin,
  createTestTrainer,
  createTestEmployee,
  createTestMember,
  clearTestData,
};
