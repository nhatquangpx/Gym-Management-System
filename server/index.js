const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const fs = require("fs-extra");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminRoutes = require("./routes/adminRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const memberRoutes = require("./routes/memberRoutes");
const trainerRoutes = require("./routes/trainerRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const packageRoutes = require("./routes/packageRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const equipmentRoutes = require('./routes/equipmentRoutes');
const gymRoomRoutes = require('./routes/gymRoomRoutes');

const app = express();
const PORT = process.env.PORT || 8001;

// Cấu hình CORS để cho phép client gọi API
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],  // Cho phép cả hai origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  optionsSuccessStatus: 200, // IE11 có vấn đề với 204
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
}));

// Debug route để test API connectivity
app.post('/api/test-request', (req, res) => {
  console.log('Test request received:');
  console.log('- Body:', req.body);
  console.log('- Headers:', req.headers);
  return res.json({ 
    success: true, 
    receivedBody: req.body,
    message: "Request received successfully" 
  });
});

connectDB();

// Đã cấu hình CORS ở trên, không cần thiết lập lại
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// Set up file upload middleware
app.use(fileUpload({
  createParentPath: true,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  },
  abortOnLimit: true,
  responseOnLimit: 'Kích thước tệp tin quá lớn (tối đa 5MB)',
  useTempFiles: true,
  tempFileDir: './tmp/'
}));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api", homepageRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/registration", registrationRoutes);
app.use('/api/equipments', equipmentRoutes);
app.use('/api/gymrooms', gymRoomRoutes);

app.listen(PORT, () => console.log(`Server run in port: ${PORT}`));
