const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    phone: {
      type: String,
      trim: true
    },    role: {
      type: String,
      enum: ["member", "admin", "employee", "trainer"],
      default: "member"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    memberInfo: {
      gender: String,
      dateOfBirth: Date,
      job: String,
      address: String,
      membershipStart: {
        type: Date
      },
      membershipEnd: {
        type: Date
      }
    },
    trainerInfo: {
      specialization: String
    },
    employeeInfo: {
      position: String,
      salary: Number,
      shiftSchedule: String,
      performanceRating: Number
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
