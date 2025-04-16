const express = require('express');
const router = express.Router();
const {createPackage, getAllPackages, getPackageById, updatePackage, deletePackage} = require('../controllers/packageController');
const {createPackageValidation, updatePackageValidation} = require('../validations/packageValidation');
const {verifyToken, verifyRole} = require('../middleware/authMiddleware');

router.get ('/', verifyToken, verifyRole(['admin']), getAllPackages);
router.get ('/:id', verifyToken, verifyRole(['admin']), getPackageById);
router.post ('/', verifyToken, verifyRole(['admin']), createPackageValidation, createPackage);
router.put ('/:id', verifyToken, verifyRole(['admin']), updatePackageValidation, updatePackage);
router.delete ('/:id', verifyToken, verifyRole(['admin']), deletePackage);

module.exports = router;
