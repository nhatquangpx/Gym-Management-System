const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ScheduleSchema = new Schema(
    {
        memberId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        trainerId: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        workoutType: {
            type: String,
            enum: ['gym', 'yoga']
        },
        date: {
            type: Date,
            required: true
        },
        timeStart: String,
        timeEnd: String,
        exercises: String,
        comment: String,
        status: {
            type: String,
            enum: ['Chưa tập', 'Đã tập', 'Vắng mặt'],
            default: 'Chưa tập'
        },
        checkinTime: String,
    },
    { timestamps: true }
);
module.exports= mongoose.model('Schedule', ScheduleSchema);