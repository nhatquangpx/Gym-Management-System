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
            newUser.memberInfo = {
                gender,
                dateOfBirth,
                job,
                address,
                membershipStart: Date.now(),
                membershipEnd
            };
        } else if (role === 'trainer') {
            newUser.trainerInfo = {
                specialization
            };
        } else if (role === 'employee') {
            newUser.employeeInfo = {
                position,
                salary,
                shiftSchedule,
                performanceRating
            };
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
            if (!user.memberInfo) user.memberInfo = {};
            
            if (gender) user.memberInfo.gender = gender;
            if (dateOfBirth) user.memberInfo.dateOfBirth = dateOfBirth;
            if (job) user.memberInfo.job = job;
            if (address) user.memberInfo.address = address;
            if (membershipEnd) user.memberInfo.membershipEnd = membershipEnd;
            // Set membershipStart if it doesn't exist
            if (!user.memberInfo.membershipStart) user.memberInfo.membershipStart = Date.now();
        } else if (user.role === 'trainer') {
            if (!user.trainerInfo) user.trainerInfo = {};
            
            if (specialization) user.trainerInfo.specialization = specialization;
        } else if (user.role === 'employee') {
            if (!user.employeeInfo) user.employeeInfo = {};
            
            if (position) user.employeeInfo.position = position;
            if (salary) user.employeeInfo.salary = salary;
            if (shiftSchedule) user.employeeInfo.shiftSchedule = shiftSchedule;
            if (performanceRating) user.employeeInfo.performanceRating = performanceRating;
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
        console.log(`Getting packages for user: ${userId}`);
        
        const Order = require('../models/Order');
        const User = require('../models/User');
        
        // Tìm user để lấy thông tin thành viên
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        
        // Tìm các đơn hàng đã thanh toán, sắp xếp theo thời gian tạo
        const paidOrders = await Order.find({ userId, status: "paid" })
            .populate('packageId')
            .sort({ createdAt: 1 }); // Sắp xếp từ cũ đến mới
        console.log(`Found ${paidOrders.length} paid orders for user ${userId}`);
        
        // Lọc các đơn hàng có packageId
        const validOrders = paidOrders.filter(order => order.packageId);
        console.log(`Found ${validOrders.length} valid orders with package information`);
        
        if (validOrders.length === 0) {
            return res.status(200).json({ packages: [] });
        }
        
        // Tính toán ngày bắt đầu và kết thúc cho từng gói
        const packages = [];
        let currentStartDate = user.memberInfo?.membershipStart ? new Date(user.memberInfo.membershipStart) : new Date();
        
        for (let i = 0; i < validOrders.length; i++) {
            const order = validOrders[i];
            const pkg = { ...order.packageId.toObject() };
            const duration = pkg.duration || 30; // mặc định 30 ngày
            
            let startDate, endDate;
            
            if (i === 0) {
                // Gói đầu tiên: sử dụng ngày bắt đầu từ memberInfo hoặc ngày tạo order
                startDate = user.memberInfo?.membershipStart ? 
                    new Date(user.memberInfo.membershipStart) : 
                    new Date(order.createdAt);
            } else {
                // Các gói tiếp theo: bắt đầu từ ngày kết thúc của gói trước
                startDate = new Date(currentStartDate);
            }
            
            // Tính ngày kết thúc
            endDate = new Date(startDate);
            if (duration >= 30) {
                // Nếu duration >= 30, coi như là tháng
                endDate.setMonth(endDate.getMonth() + Math.floor(duration / 30));
                endDate.setDate(endDate.getDate() + (duration % 30));
            } else {
                // Nếu duration < 30, coi như là ngày
                endDate.setDate(endDate.getDate() + duration);
            }
            
            // Cập nhật startDate cho gói tiếp theo
            currentStartDate = new Date(endDate);
            
            // Thêm thông tin ngày vào package
            pkg.startDate = startDate;
            pkg.endDate = endDate;
            pkg.orderDate = order.createdAt;
            
            packages.push(pkg);
        }
        
        console.log(`Returning ${packages.length} packages with calculated dates`);
        res.status(200).json({ packages });
    } catch (err) {
        console.error('Error in getMyPackages:', err);
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