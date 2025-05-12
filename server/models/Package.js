const mongoose = require("mongoose");

const PackageSchema = new mongoose.Schema({
    id: {
        type: String,
        required: false,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    price: {
        type: Number,
        required: true
    },
    period: {
        type: String,
        default: "/tháng"
    },
    type: {
        type: String, 
        enum: ["Tự tập", "Tập với PT"],
        default: "Tự tập"
    },
    features: {
        type: [String],
        default: []
    },
    duration: {
        type: Number,
        default: 30,  // Số ngày có hiệu lực của gói
        required: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Package", PackageSchema);