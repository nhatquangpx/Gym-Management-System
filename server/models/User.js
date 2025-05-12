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
    },
    role: {
      type: String,
      enum: ["member", "admin", "employee", "trainer"],
      default: "member"
    },
    // Member fields
    gender: String,
    dateOfBirth: Date,
    job: String,
    address: String,
    membershipStart: {
      type: Date
    },
    membershipEnd: {
      type: Date
    },
    // Trainer fields
    specialization: String,
    // Employee fields
    position: String,
    salary: Number,
    shiftSchedule: String,
    performanceRating: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
