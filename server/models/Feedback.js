const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['Gói tập', 'Huấn luyện viên'],
    required: true
  },
  text: {
    type: String,
    default: ''
  },
  star: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema); 