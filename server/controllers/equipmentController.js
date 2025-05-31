const Equipment = require('../models/Equipment');
const { sendMaintenanceNotificationEmail, sendBulkMaintenanceNotificationEmail } = require('../utils/emailService');

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

// Gửi email thông báo bảo trì đơn lẻ
exports.sendMaintenanceEmail = async (req, res) => {
  try {
    const { equipmentId, issueDetails } = req.body;
    const equipment = await Equipment.findById(equipmentId);
    
    if (!equipment) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    if (equipment.status !== 'maintenance' && equipment.status !== 'inactive') {
      return res.status(400).json({ error: 'Equipment is not in maintenance or inactive status' });
    }

    const maintenanceEmail = process.env.MAINTENANCE_EMAIL;
    const success = await sendMaintenanceNotificationEmail(
      equipment.name,
      issueDetails || 'Không có mô tả chi tiết',
      maintenanceEmail
    );

    if (success) {
      res.json({ message: 'Maintenance notification email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send maintenance notification email' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Gửi email thông báo bảo trì hàng loạt
exports.sendBulkMaintenanceEmail = async (req, res) => {
  try {
    const { equipmentIds, issueDetails } = req.body;
    
    const equipments = await Equipment.find({
      _id: { $in: equipmentIds },
      status: { $in: ['maintenance', 'inactive'] }
    });

    if (equipments.length === 0) {
      return res.status(404).json({ error: 'No equipment found in maintenance or inactive status' });
    }

    const maintenanceEmail = process.env.MAINTENANCE_EMAIL;
    const success = await sendBulkMaintenanceNotificationEmail(
      equipments.map(eq => ({
        name: eq.name,
        issueDetails: issueDetails[eq._id] || 'Không có mô tả chi tiết'
      })),
      maintenanceEmail
    );

    if (success) {
      res.json({ message: 'Bulk maintenance notification email sent successfully' });
    } else {
      res.status(500).json({ error: 'Failed to send bulk maintenance notification email' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
