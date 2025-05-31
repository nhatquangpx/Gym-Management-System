const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');
const { verifyToken, verifyRole } = require("../middleware/authMiddleware");

router.get('/', equipmentController.getAllEquipments);
router.post('/', equipmentController.createEquipment);
router.get('/room/:id', equipmentController.getEquipmentsByRoom);
router.get('/:id', equipmentController.getEquipmentById);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);
// Gửi email thông báo bảo trì đơn lẻ
router.post('/maintenance-email',[verifyToken, verifyRole(['admin', 'employee'])], equipmentController.sendMaintenanceEmail);
// Gửi email thông báo bảo trì hàng loạt
router.post('/bulk-maintenance-email',[verifyToken, verifyRole(['admin', 'employee'])], equipmentController.sendBulkMaintenanceEmail);

module.exports = router;
