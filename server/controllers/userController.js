const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng!', error: err.message });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ!' });
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại!' });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin người dùng!', error: err.message });
    }
}

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, phone, 
               // Member fields
               gender, dateOfBirth, job, address, membershipEnd,
               // Trainer fields
               specialization,
               // Employee fields
               position, salary, shiftSchedule, performanceRating } = req.body;
        
        if (!name || !password || !email || !role) {
            return res.status(400).json({ message: 'Các trường bắt buộc không được để trống!' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã được sử dụng!' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); 

        // Create user with role-specific fields
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            phone
        });
        
        // Add role-specific fields
        if (role === 'member') {
            newUser.gender = gender;
            newUser.dateOfBirth = dateOfBirth;
            newUser.job = job;
            newUser.address = address;
            newUser.membershipStart = Date.now();
            newUser.membershipEnd = membershipEnd;
        } else if (role === 'trainer') {
            newUser.specialization = specialization;
        } else if (role === 'employee') {
            newUser.position = position;
            newUser.salary = salary;
            newUser.shiftSchedule = shiftSchedule;
            newUser.performanceRating = performanceRating;
        }
        await newUser.save();
        res.status(201).json({ message: 'Người dùng đã được tạo thành công!', user: newUser });
    }
    catch (err) {
        res.status(500).json({ message: 'Lỗi khi tạo người dùng!', error: err.message });
    }
}
exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ!' });
        }

        // Get user first to handle role changes properly
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại!' });
        }

        // Handle basic fields
        const { name, email, phone, role,
                // Member fields
                gender, dateOfBirth, job, address, membershipEnd,
                // Trainer fields
                specialization,
                // Employee fields
                position, salary, shiftSchedule, performanceRating } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        
        // If role is being changed, update role-specific fields
        if (role && role !== user.role) {
            user.role = role;
        }
        
        // Update role-specific fields
        if (user.role === 'member') {
            if (gender) user.gender = gender;
            if (dateOfBirth) user.dateOfBirth = dateOfBirth;
            if (job) user.job = job;
            if (address) user.address = address;
            if (membershipEnd) user.membershipEnd = membershipEnd;
            // Set membershipStart if it doesn't exist
            if (!user.membershipStart) user.membershipStart = Date.now();
        } else if (user.role === 'trainer') {
            if (specialization) user.specialization = specialization;
        } else if (user.role === 'employee') {
            if (position) user.position = position;
            if (salary) user.salary = salary;
            if (shiftSchedule) user.shiftSchedule = shiftSchedule;
            if (performanceRating) user.performanceRating = performanceRating;
        }
        
        await user.save();
        
        const updatedUser = await User.findById(userId).select('-password');
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi cập nhật thông tin người dùng!', error: err.message });
    }
}

exports.getMyPackages = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id;
        const Order = require('../models/Order');
        const paidOrders = await Order.find({ userId, status: "paid" }).populate('packageId');
        const packages = paidOrders.map(order => order.packageId);
        res.status(200).json({ packages });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi truy vấn gói tập của bạn!', error: err.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ!' });
        }

        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Người dùng không tồn tại!' });
        }

        res.status(200).json({ message: 'Người dùng đã được xóa thành công!' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi khi xóa người dùng!', error: err.message });
    }
}