const mongoose = require("mongoose");

const MemberSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true
        },
        gender: String,
        dateOfBirth: Date,
        job: String,
        address: String,
        membershipStart: {
            type: Date,
            required: true,
            dafault: Date.now
        },
        membershipEnd: {
            type: Date,
            required: true,
            default: function() {}
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Member", MemberSchema);
