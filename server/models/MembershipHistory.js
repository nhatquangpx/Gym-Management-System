const mongoose = require("mongoose");

const MembershipHistorySchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
        index: true 
    },
    packageId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Package", 
        required: true 
    },
    trainerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Trainer",
    },
    orderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Order" 
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["Chờ kích hoạt", "Đã kích hoạt", "Hết hạn", "Đã hủy"],
        default: "Chờ kích hoạt"
    },
}, { timestamps: true });

module.exports = mongoose.model("MembershipHistory", MembershipHistorySchema);
