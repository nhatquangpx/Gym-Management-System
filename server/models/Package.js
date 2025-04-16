const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    package_type: {
      type: String,
      enum: ["MONTHLY", "SESSION", "VIP", "PRIVATE"],
      required: true
    },
    duration_in_days: {
      type: Number,
      default: null
    },
    number_of_sessions: {
      type: Number,
      default: null
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active" 
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

module.exports = mongoose.model("Package", PackageSchema);
