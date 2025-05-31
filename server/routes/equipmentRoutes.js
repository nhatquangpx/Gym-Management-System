const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

router.get('/', equipmentController.getAllEquipments);
router.post('/', equipmentController.createEquipment);
router.get('/room/:id', equipmentController.getEquipmentsByRoom);
router.get('/:id', equipmentController.getEquipmentById);
router.put('/:id', equipmentController.updateEquipment);
router.delete('/:id', equipmentController.deleteEquipment);

module.exports = router;
