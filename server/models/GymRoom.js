const mongoose = require('mongoose');

const gymRoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roomType: { type: String, required: true },
  status: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GymRoom', gymRoomSchema);
