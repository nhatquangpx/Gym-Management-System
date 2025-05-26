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
    isActive: {
        type: Boolean,
        default: true
    },
    isRenewal: {
        type: Boolean,
        default: false
    },
    renewalType: {
        type: String,
        enum: ["new", "renew", "buyMore"],
        default: "new"
    },
    sessionsTotal: {
        type: Number,
        default: 0
    },
    sessionsUsed: {
        type: Number, 
        default: 0
    },
    previousMembershipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MembershipHistory"
    },
    price: {
        type: Number
    },
    cancelledDate: {
        type: Date
    },
    cancelReason: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model("MembershipHistory", MembershipHistorySchema);
