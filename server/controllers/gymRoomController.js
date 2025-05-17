const GymRoom = require('../models/GymRoom');

// Lấy danh sách phòng tập
exports.getAllGymRooms = async (req, res) => {
  try {
    const gymRooms = await GymRoom.find();
    res.json(gymRooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm phòng tập mới
exports.createGymRoom = async (req, res) => {
  try {
    const gymRoom = new GymRoom(req.body);
    await gymRoom.save();
    res.status(201).json(gymRoom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy thông tin phòng tập theo ID
exports.getGymRoomById = async (req, res) => {
  try {
    const gymRoom = await GymRoom.findById(req.params.id);
    if (!gymRoom) return res.status(404).json({ error: 'Gym room not found' });
    res.json(gymRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật phòng tập
exports.updateGymRoom = async (req, res) => {
  try {
    const gymRoom = await GymRoom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!gymRoom) return res.status(404).json({ error: 'Gym room not found' });
    res.json(gymRoom);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa phòng tập
exports.deleteGymRoom = async (req, res) => {
  try {
    const gymRoom = await GymRoom.findByIdAndDelete(req.params.id);
    if (!gymRoom) return res.status(404).json({ error: 'Gym room not found' });
    res.json({ message: 'Gym room deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
