const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GymRoom',
    required: true
  },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, required: true },
  purchaseDate: { type: Date },
  warrantyDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Equipment', equipmentSchema);
