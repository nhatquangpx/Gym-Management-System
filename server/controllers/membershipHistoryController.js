const MembershipHistory = require('../models/MembershipHistory');
const User = require('../models/User');
const Order = require('../models/Order');
const Package = require('../models/Package');

// Lấy lịch sử gói tập của một thành viên cụ thể
exports.getMembershipHistoryByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Kiểm tra quyền truy cập (chỉ admin, nhân viên hoặc chính người dùng đó mới có thể xem)
        if (req.user.role !== 'admin' && req.user.role !== 'employee' && req.user.id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem thông tin này'
            });
        }
        
        const membershipHistory = await MembershipHistory.find({ userId })
            .populate('packageId', 'name description price type duration')
            .populate('orderId', 'status orderType amount')
            .sort({ startDate: -1 }); // Sắp xếp theo ngày bắt đầu giảm dần
        
        return res.json({
            success: true,
            data: membershipHistory
        });
    } catch (error) {
        console.error('Error getting membership history:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Lấy lịch sử gói tập của thành viên hiện tại
exports.getMyMembershipHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`Fetching membership history for user: ${userId}`);
        
        const membershipHistory = await MembershipHistory.find({ userId })
            .populate('packageId', 'name description price type duration features period sessions')
            .sort({ startDate: -1 }); // Sắp xếp theo ngày bắt đầu giảm dần
            
        console.log(`Found ${membershipHistory.length} membership records`);
        
        // Tính toán thông tin bổ sung
        const enhancedHistory = membershipHistory.map(history => {
            console.log(`Processing history record: ${history._id}`);
            
            const now = new Date();
            const isExpired = history.endDate < now;
            const isActive = !isExpired && history.isActive;
            
            // Tính số ngày còn lại hoặc đã hết hạn
            let daysRemaining = 0;
            if (isActive) {
                daysRemaining = Math.ceil((history.endDate - now) / (1000 * 60 * 60 * 24));
            } else if (isExpired) {
                daysRemaining = -Math.ceil((now - history.endDate) / (1000 * 60 * 60 * 24));
            }
            
            // Tính số buổi tập còn lại
            const sessionsRemaining = Math.max(0, history.sessionsTotal - history.sessionsUsed);
            
            // Log package details to help with debugging
            if (history.packageId) {
                console.log(`Package info: ${history.packageId.name}, ID: ${history.packageId._id}`);
            } else {
                console.log('Warning: Package ID is null or undefined for this history record');
            }
            
            return {
                _id: history._id,
                packageId: history.packageId ? history.packageId._id : null,
                startDate: history.startDate,
                endDate: history.endDate,
                isActive: isActive,
                isRenewal: history.isRenewal,
                renewalType: history.renewalType,
                sessionsTotal: history.sessionsTotal,
                sessionsUsed: history.sessionsUsed,
                sessionsRemaining: sessionsRemaining,
                price: history.price,
                status: isActive ? 'Đang sử dụng' : (isExpired ? 'Đã hết hạn' : 'Đã hủy'),
                daysRemaining: daysRemaining
            };
        });
        
        console.log(`Returning ${enhancedHistory.length} processed history records`);
        
        return res.json({
            success: true,
            data: enhancedHistory
        });
    } catch (error) {
        console.error('Error getting my membership history:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Lấy thông tin chi tiết về một lịch sử gói tập cụ thể
exports.getMembershipHistoryById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const membershipHistory = await MembershipHistory.findById(id)
            .populate('packageId', 'name description price type duration features')
            .populate('userId', 'name email phone');
        
        if (!membershipHistory) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch sử gói tập'
            });
        }
        
        // Kiểm tra quyền truy cập
        if (req.user.role !== 'admin' && req.user.role !== 'employee' && req.user.id !== membershipHistory.userId._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem thông tin này'
            });
        }
        
        return res.json({
            success: true,
            data: membershipHistory
        });
    } catch (error) {
        console.error('Error getting membership history by ID:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Cập nhật thông tin lịch sử gói tập
exports.updateMembershipHistory = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        // Chỉ cho phép cập nhật một số trường nhất định
        const allowedUpdates = ['sessionsUsed', 'isActive', 'endDate'];
        const updateObj = {};
        
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateObj[key] = updates[key];
            }
        });
        
        const membershipHistory = await MembershipHistory.findById(id);
        
        if (!membershipHistory) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch sử gói tập'
            });
        }
        
        // Chỉ admin và nhân viên mới có thể cập nhật
        if (req.user.role !== 'admin' && req.user.role !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền cập nhật thông tin này'
            });
        }
        
        const updatedHistory = await MembershipHistory.findByIdAndUpdate(
            id, 
            updateObj, 
            { new: true }
        );
        
        return res.json({
            success: true,
            message: 'Cập nhật thông tin gói tập thành công',
            data: updatedHistory
        });
    } catch (error) {
        console.error('Error updating membership history:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Đánh dấu gói tập đã hủy
exports.cancelMembership = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        
        const membershipHistory = await MembershipHistory.findById(id);
        
        if (!membershipHistory) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy lịch sử gói tập'
            });
        }
        
        // Kiểm tra quyền truy cập
        if (req.user.role !== 'admin' && req.user.role !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền hủy gói tập'
            });
        }
        
        // Đánh dấu gói tập đã hủy
        membershipHistory.isActive = false;
        membershipHistory.cancelledDate = new Date();
        membershipHistory.cancelReason = reason || 'Không có lý do';
        
        await membershipHistory.save();
        
        // Cập nhật thông tin thành viên
        const user = await User.findById(membershipHistory.userId);
        
        if (user && user.memberInfo) {
            // Nếu đây là gói tập đang sử dụng, cập nhật thông tin thành viên
            if (
                user.memberInfo.membershipEnd && 
                user.memberInfo.membershipStart && 
                new Date(user.memberInfo.membershipEnd).getTime() === new Date(membershipHistory.endDate).getTime()
            ) {
                user.memberInfo.membershipEnd = new Date(); // Kết thúc gói tập ngay lập tức
                await user.save();
            }
        }
        
        return res.json({
            success: true,
            message: 'Hủy gói tập thành công',
            data: membershipHistory
        });
    } catch (error) {
        console.error('Error cancelling membership:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message
        });
    }
};
