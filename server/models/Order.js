const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    trainerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Store selected trainer for new registrations
    amount: { type: Number, required: true },
    orderType: { type: String, default: "gym_package" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    // VNPAY fields
    vnp_TxnRef: { type: String },
    vnp_TransactionNo: { type: String },
    vnp_ResponseCode: { type: String },
    vnp_PayDate: { type: String },
    vnp_OrderInfo: { type: String },
    vnp_SecureHash: { type: String },
    // Manual banking fields
    bankId: { type: String }, // Bank identifier for banking payments
    receiptImage: { type: String }, // Path to uploaded receipt image
    receiptUploadDate: { type: Date }, // When the receipt was uploaded
    verificationNote: { type: String } // Note from admin when verifying payment
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
