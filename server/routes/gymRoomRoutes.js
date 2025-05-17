const express = require('express');
const router = express.Router();
const gymRoomController = require('../controllers/gymRoomController');

router.get('/', gymRoomController.getAllGymRooms);
router.post('/', gymRoomController.createGymRoom);
router.get('/:id', gymRoomController.getGymRoomById);
router.put('/:id', gymRoomController.updateGymRoom);
router.delete('/:id', gymRoomController.deleteGymRoom);

module.exports = router;
