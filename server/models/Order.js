const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    amount: { type: Number, required: true },
    orderType: { type: String, default: "gym_package" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    vnp_TxnRef: { type: String },
    vnp_TransactionNo: { type: String },
    vnp_ResponseCode: { type: String },
    vnp_PayDate: { type: String },
    vnp_OrderInfo: { type: String },
    vnp_SecureHash: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
