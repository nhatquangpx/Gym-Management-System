const Package = require('../models/Package');
const mongoose = require('mongoose');

// @des Get all packages
// @route GET /api/packages
// @access Private (Admin)
exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.find();
        res.status(200).json(packages);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách gói!', error: err.message });
    }
}

// @des Get package by ID
// @route GET /api/packages/:id
// @access Private (Admin)
exports.getPackageById = async (req, res) => {
    try {
        const packageId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(packageId)) {
            return res.status(400).json({ message: 'ID gói không hợp lệ!' });
        }

        const package = await Package.findById(packageId);
        if (!package) {
            return res.status(404).json({ message: 'Gói không tồn tại!' });
        }

        res.status(200).json(package);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin gói!', error: err.message });
    }
}

// @des Create a new package
// @route POST /api/packages
// @access Private (Admin)
exports.createPackage = async (req, res) => {
    try {
        const { name, description, package_type, duration_in_days, number_of_sessions, price, discount, status } = req.body;

        const newPackage = new Package({
            name,
            description,
            package_type,
            duration_in_days,
            number_of_sessions,
            price,
            discount,
            status
        });

        await newPackage.save();
        res.status(201).json({ message: 'Gói đã được tạo thành công!', package: newPackage });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi tạo gói mới!', error: err.message });
    }
}

// @des Update a package
// @route PATCH /api/packages/:id
// @access Private (Admin)
exports.updatePackage = async (req, res) => {
    try {
        const packageId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(packageId)) {
            return res.status(400).json({ message: 'ID gói không hợp lệ!' });
        }

        const updatedPackage = await Package.findByIdAndUpdate(packageId, req.body, { new: true });
        if (!updatedPackage) {
            return res.status(404).json({ message: 'Gói không tồn tại!' });
        }

        res.status(200).json({ message: 'Gói đã được cập nhật thành công!', package: updatedPackage });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật gói!', error: err.message });
    }
}

// @des Delete a package
// @route DELETE /api/packages/:id
// @access Private (Admin)
exports.deletePackage = async (req, res) => {
    try {
        const packageId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(packageId)) {
            return res.status(400).json({ message: 'ID gói không hợp lệ!' });
        }

        const deletedPackage = await Package.findByIdAndDelete(packageId);
        if (!deletedPackage) {
            return res.status(404).json({ message: 'Gói không tồn tại!' });
        }

        res.status(200).json({ message: 'Gói đã được xóa thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa gói!', error: err.message });
    }
}

