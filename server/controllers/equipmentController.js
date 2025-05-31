const Equipment = require('../models/Equipment');

// Lấy danh sách thiết bị
exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find().populate('roomId');
    res.json(equipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách thiết bị theo phòng
exports.getEquipmentsByRoom = async (req, res) => {
  try {
    const equipments = await Equipment.find({ roomId: req.params.id }).populate('roomId');
    res.json(equipments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Thêm thiết bị mới
exports.createEquipment = async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    res.status(201).json(equipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Lấy thông tin thiết bị theo ID
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id).populate('roomId');
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json(equipment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thiết bị
exports.updateEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json(equipment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Xóa thiết bị
exports.deleteEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
