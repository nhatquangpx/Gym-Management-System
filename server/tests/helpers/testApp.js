const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const path = require("path");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("../../routes/authRoutes");
const adminUserRoutes = require("../../routes/adminUserRoutes");
const adminRoutes = require("../../routes/adminRoutes");
const homepageRoutes = require("../../routes/homepageRoutes");
const memberRoutes = require("../../routes/memberRoutes");
const trainerRoutes = require("../../routes/trainerRoutes");
const employeeRoutes = require("../../routes/employeeRoutes");
const paymentRoutes = require("../../routes/paymentRoutes");
const packageRoutes = require("../../routes/packageRoutes");
const userRoutes = require("../../routes/userRoutes");
const orderRoutes = require("../../routes/orderRoutes");
const registrationRoutes = require("../../routes/registrationRoutes");
const equipmentRoutes = require("../../routes/equipmentRoutes");
const gymRoomRoutes = require("../../routes/gymRoomRoutes");
const feedbackRoutes = require("../../routes/feedbackRoutes");
const scheduleRoutes = require("../../routes/scheduleRoutes");

const createTestApp = () => {
  const app = express();

  // Kiểm tra kết nối MongoDB
  const checkMongoConnection = () => {
    if (mongoose.connection.readyState !== 1) {
      
      // Thử kết nối nếu chưa kết nối
      if (mongoose.connection.readyState === 0) {
      }
      
      return false;
    } else {
      return true;
    }
  }
  
  // Kiểm tra kết nối
  checkMongoConnection();

  // Cấu hình CORS cho testing
  app.use(
    cors({
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
      optionsSuccessStatus: 200,
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Accept",
      ],
      credentials: true,
    })
  );

  // Middleware cơ bản
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "../../public")));

  // File upload middleware cho testing
  app.use(
    fileUpload({
      createParentPath: true,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
      abortOnLimit: true,
      responseOnLimit: "Kích thước tệp tin quá lớn (tối đa 5MB)",
      useTempFiles: true,
      tempFileDir: "./tmp/",
    })
  );

  // Test route
  app.post("/api/test-request", (req, res) => {
    return res.json({
      success: true,
      receivedBody: req.body,
      message: "Request received successfully",
    });
  });

  // Setup routes
  app.use("/api/auth", authRoutes);
  app.use("/api/admin", adminUserRoutes);
  app.use("/api/admins", adminRoutes);
  app.use("/api", homepageRoutes);
  app.use("/api/members", memberRoutes);
  app.use("/api/trainers", trainerRoutes);
  app.use("/api/employees", employeeRoutes);
  app.use("/api/payment", paymentRoutes);
  app.use("/api/packages", packageRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/registration", registrationRoutes);
  app.use("/api/equipments", equipmentRoutes);
  app.use("/api/gymrooms", gymRoomRoutes);
  app.use("/api/feedbacks", feedbackRoutes);
  app.use("/api/schedules", scheduleRoutes);

  return app;
};

module.exports = createTestApp;
