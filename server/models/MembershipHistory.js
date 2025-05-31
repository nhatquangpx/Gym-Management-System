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
    renewalType: {
        type: String,
        enum: ["new", "renew"],
        default: "new"
    },
}, { timestamps: true });

module.exports = mongoose.model("MembershipHistory", MembershipHistorySchema);
