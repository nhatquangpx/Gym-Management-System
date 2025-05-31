const Order = require("../models/Order");
const User = require("../models/User");
const Package = require("../models/Package");
const { validationResult } = require("express-validator");
const fs = require("fs-extra");
const path = require("path");

// @desc    Create a new manual order
// @route   POST /api/orders/manual
// @access  Public
exports.createManualOrder = async (req, res) => {
    try {
        const { userId, packageId, paymentMethod, amount, orderInfo, bankId } = req.body;
        
        // Kiểm tra gói tập
        const gymPackage = await Package.findById(packageId);
        if (!gymPackage) {
            return res.status(404).json({ 
                success: false,
                message: "Không tìm thấy gói tập" 
            });
        }
        
        // Tạo đơn hàng chờ xác nhận
        const order = await Order.create({
            userId,
            packageId,
            amount,
            orderType: paymentMethod === 'banking' ? 'bank_transfer' : 'momo',
            status: "pending",
            vnp_OrderInfo: orderInfo || `Thanh toan goi tap ${gymPackage.name}`,
            bankId: paymentMethod === 'banking' ? bankId : null
        });

        return res.json({
            success: true,
            message: "Đơn hàng đã được tạo thành công",
            order: {
                orderId: order._id,
                amount,
                status: order.status,
                packageName: gymPackage.name,
                orderType: order.orderType
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false,
            message: "Lỗi máy chủ" 
        });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .populate('packageId', 'name price description')
            .sort('-createdAt');
        
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (Admin or Order Owner)
exports.getOrderById = async (req, res) => {
    try {
        // Validate ObjectId
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                success: false,
                message: "ID đơn hàng không hợp lệ"
            });
        }

        const order = await Order.findById(req.params.id)
            .populate('userId', 'name email phone')
            .populate('packageId', 'name price description duration');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng"
            });
        }

        // Check if request is from admin or order owner
        if (req.user.role !== 'admin' && req.user.role !== 'employee' && order.userId._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập đơn hàng này"
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error in getOrderById:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server: " + error.message
        });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Admin)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['pending', 'paid', 'failed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Trạng thái không hợp lệ"
            });
        }
        
        const order = await Order.findById(req.params.id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng"
            });
        }
        
        // Update order status
        order.status = status;
        await order.save();
        
        // If payment is successful and status changes to paid, update user membership
        if (status === 'paid' && order.status !== 'paid') {
            const user = await User.findById(order.userId);
            const gymPackage = await Package.findById(order.packageId);
            
            if (user && gymPackage) {
                // Calculate new membership end date
                const membershipEnd = new Date();
                membershipEnd.setMonth(membershipEnd.getMonth() + (gymPackage.duration || 1));
                
                // Update membership info
                user.role = 'member';
                
                // Đảm bảo memberInfo tồn tại
                if (!user.memberInfo) {
                    user.memberInfo = {};
                }
                
                user.memberInfo.membershipStart = new Date();
                user.memberInfo.membershipEnd = membershipEnd;
                await user.save();
            }
        }
        
        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái đơn hàng thành công",
            data: order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// @desc    Get orders by user
// @route   GET /api/orders/user
// @access  Private 
exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('packageId', 'name price description')
            .sort('-createdAt');
        
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};

// @desc    Upload receipt for manual payment
// @route   POST /api/orders/upload-receipt
// @access  Public
exports.uploadReceipt = async (req, res) => {
    try {
        if (!req.files || !req.files.receipt) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng tải lên ảnh hóa đơn"
            });
        }

        const { orderId } = req.body;
        
        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "Thiếu thông tin đơn hàng"
            });
        }
        
        const order = await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng"
            });
        }

        // Handle file upload
        const receiptFile = req.files.receipt;
        const fileExtension = receiptFile.name.split('.').pop();
        const fileName = `receipt_${orderId}_${Date.now()}.${fileExtension}`;
        const uploadPath = `./public/uploads/receipts/${fileName}`;
        
        // Create directory if it doesn't exist
        const dirPath = './public/uploads/receipts';
        if (!fs.existsSync(dirPath)){
            fs.mkdirSync(dirPath, { recursive: true });
        }
          // Move file to uploads folder
        try {
            await receiptFile.mv(uploadPath);
        } catch (moveError) {
            console.error('Error moving file:', moveError);
            return res.status(500).json({
                success: false,
                message: "Lỗi khi lưu trữ file: " + moveError.message
            });
        }
        
        // Update order with receipt info
        order.receiptImage = `/uploads/receipts/${fileName}`;
        order.receiptUploadDate = new Date();
        await order.save();
        
        res.status(200).json({
            success: true,
            message: "Hóa đơn đã được tải lên thành công",
            data: {
                orderId: order._id,
                receiptImage: order.receiptImage
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi server khi tải lên hóa đơn"
        });
    }
};

// @desc    Get order by transaction reference
// @route   GET /api/orders/by-txnref/:txnRef
// @access  Public (needed for payment return page)
exports.getOrderByTxnRef = async (req, res) => {
    try {
        const { txnRef } = req.params;
        
        if (!txnRef) {
            return res.status(400).json({
                success: false,
                message: "Thiếu mã giao dịch"
            });
        }
        
        const order = await Order.findOne({ vnp_TxnRef: txnRef })
            .populate('userId', 'name email role memberInfo')
            .populate('packageId', 'name price description duration');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng với mã giao dịch này"
            });
        }
        
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Error fetching order by txnRef:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server"
        });
    }
};
