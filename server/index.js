const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");

const app = express();
const PORT = process.env.PORT || 8001;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminUserRoutes);

app.listen(PORT, () => console.log(`Server run in port: ${PORT}`));
