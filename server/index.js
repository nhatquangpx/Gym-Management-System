const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const homepageRoutes = require("./routes/homepageRoutes");
const memberRoutes = require("./routes/memberRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const packageRoutes = require("./routes/packageRoutes");

const app = express();
const PORT = process.env.PORT || 8001;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api", homepageRoutes);
app.use("/api", homepageRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/packages", packageRoutes);
app.listen(PORT, () => console.log(`Server run in port: ${PORT}`));
