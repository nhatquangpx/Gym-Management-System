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
            enum: ['Chưa tham gia', 'Đã tham gia', 'Không tham gia'],
            default: 'Chưa tham gia'
        }
    },
    { timestamps: true }
);
module.exports= mongoose.model('Schedule', ScheduleSchema);