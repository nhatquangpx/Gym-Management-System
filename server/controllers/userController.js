const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const TrainerFeedback = require('../models/TrainerFeedback');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ users });
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
        const MembershipHistory = require('../models/MembershipHistory');

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        
        const paidOrders = await MembershipHistory.find({ userId, status: "Đã kích hoạt" })
            .populate('packageId')
            .sort({ createdAt: 1 });

        // Xử lý từng order một và đợi tất cả hoàn thành
        const packages = await Promise.all(paidOrders.map(async (order) => {
            if (!order.packageId) return null;
            
            // Tạo object cơ bản cho package
            const packageData = {
                _id: order.packageId._id,
                id: order.packageId.id,
                regested: order._id,
                name: order.packageId.name,
                description: order.packageId.description,
                price: order.packageId.price,
                period: order.packageId.period,
                type: order.packageId.type,
                typePackage: order.packageId.typePackage,
                features: order.packageId.features || [],
                duration: order.packageId.duration,
                __v: order.packageId.__v,
                createdAt: order.packageId.createdAt,
                updatedAt: order.packageId.updatedAt,
                startDate: order.startDate,
                endDate: order.endDate,
                orderDate: order.createdAt
            };

            // Nếu có trainerId, lấy thông tin trainer
            if (order.trainerId && order.packageId.type === 'Tập với PT') {
                try {
                    const trainer = await User.findById(order.trainerId).select('name');
                    if (trainer) {
                        packageData.trainerId = order.trainerId;
                        packageData.trainerName = trainer.name;
                    }
                } catch (error) {
                    console.error(`Error fetching trainer for order ${order._id}:`, error);
                }
            }

            return packageData;
        }));

        // Lọc bỏ các null values
        const validPackages = packages.filter(pkg => pkg !== null);
        
        console.log('Formatted packages:', validPackages);
        res.status(200).json({ packages: validPackages });
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

// @desc    Get trainer feedback for member's packages
// @route   GET /api/users/my-feedback/:packageId
// @access  Private (Member)
exports.getPackageFeedback = async (req, res) => {
  try {
    const { packageId } = req.params;
    const memberId = req.user.id;
    console.log(`Getting feedback for member: ${memberId}, package: ${packageId}`);
    // Find all feedback for this member and package
    const feedback = await TrainerFeedback.find({ 
      memberId,
      packageId 
    })
    .populate('trainerId', 'name') // Get trainer name
    .sort({ createdAt: -1 }); // Sort by newest first

    // Format feedback to match frontend structure
    const formattedFeedback = feedback.map(fb => ({
      id: fb._id,
      text: fb.content,
      time: new Date(fb.date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      trainer: `Huấn luyện viên ${fb.trainerId.name}`
    }));

    res.status(200).json({
      success: true,
      data: formattedFeedback
    });

  } catch (error) {
    console.error('Error getting package feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy nhận xét của huấn luyện viên',
      error: error.message
    });
  }
};