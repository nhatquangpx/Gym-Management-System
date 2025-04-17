const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    position: String,
    salary: Number,
    shiftSchedule: String,
    performanceRating: Number
},
    { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
