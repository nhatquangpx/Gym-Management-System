const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Create an admin user (can only be done by another admin)
router.post('/', [verifyToken, verifyRole(['admin'])], async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Tất cả các trường bắt buộc phải được điền' });
        }

        // Check if user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email này đã được sử dụng' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin user
        const admin = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'admin'
        });

        await admin.save();
        
        // Don't return the password
        const adminResponse = {
            _id: admin._id,
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
            role: admin.role
        };

        res.status(201).json({
            success: true,
            message: 'Tài khoản admin đã được tạo thành công',
            data: adminResponse
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Get all admin users
router.get('/', [verifyToken, verifyRole(['admin'])], async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        
        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Get admin by ID
router.get('/:id', [verifyToken, verifyRole(['admin'])], async (req, res) => {
    try {
        const adminId = req.params.id;
        
        const admin = await User.findOne({ _id: adminId, role: 'admin' }).select('-password');
        
        if (!admin) {
            return res.status(404).json({ message: 'Không tìm thấy admin' });
        }
        
        res.status(200).json({
            success: true,
            data: admin
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Update admin
router.put('/:id', [verifyToken, verifyRole(['admin'])], async (req, res) => {
    try {
        const adminId = req.params.id;
        const { name, email, phone } = req.body;
        
        // Ensure we're only updating an admin
        const admin = await User.findOne({ _id: adminId, role: 'admin' });
        
        if (!admin) {
            return res.status(404).json({ message: 'Không tìm thấy admin' });
        }
        
        // Update fields
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;
        
        // If password is provided, hash and update it
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash(req.body.password, salt);
        }
        
        await admin.save();
        
        res.status(200).json({
            success: true,
            message: 'Cập nhật thông tin admin thành công',
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                role: admin.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// Delete admin
router.delete('/:id', [verifyToken, verifyRole(['admin'])], async (req, res) => {
    try {
        const adminId = req.params.id;
        
        // Make sure we don't delete the last admin
        const adminCount = await User.countDocuments({ role: 'admin' });
        
        if (adminCount <= 1) {
            return res.status(400).json({ 
                message: 'Không thể xóa admin cuối cùng trong hệ thống' 
            });
        }
        
        // Make sure we don't delete ourselves
        if (req.user.id === adminId) {
            return res.status(400).json({ 
                message: 'Bạn không thể xóa tài khoản admin của chính mình' 
            });
        }
        
        const result = await User.deleteOne({ _id: adminId, role: 'admin' });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Không tìm thấy admin' });
        }
        
        res.status(200).json({
            success: true,
            message: 'Xóa admin thành công'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;
