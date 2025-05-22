const Order = require("../models/Order");
const Package = require("../models/Package");
const qs = require("qs");
const crypto = require("crypto");

// Lấy config từ biến môi trường
const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURNURL;

// Tạo URL thanh toán VNPAY
exports.createVnpayPayment = async (req, res) => {
    try {
        console.log('VNPAY Payment Request received:');
        console.log('- Request body:', req.body);
        console.log('- Headers:', req.headers);
        
        // Kiểm tra body có rỗng không
        if (!req.body || Object.keys(req.body).length === 0) {
            console.error('Empty request body received');
            return res.status(400).json({ 
                message: "Invalid request - empty body", 
                received: req.body 
            });
        }
        const { userId, packageId } = req.body;
          // Kiểm tra tham số bắt buộc
        if (!userId || !packageId) {
            console.error('Missing required parameters:', { userId, packageId });
            return res.status(400).json({ 
                message: "Missing required parameters", 
                received: { userId, packageId } 
            });
        }

        // Nếu có orderId, sử dụng đơn hàng hiện có thay vì tạo mới
        const { orderId } = req.body;
        let order = null;
          // Biến lưu thông tin gói tập
        let gymPackage = null;
        let packageIdToUse = null;
        
        if (orderId) {
            console.log('Using existing order:', orderId);
            order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({ 
                    message: "Order not found", 
                    received: { orderId } 
                });
            }
            
            // Kiểm tra trạng thái đơn hàng
            if (order.status !== 'pending') {
                return res.status(400).json({ 
                    message: "Order is not in pending status", 
                    status: order.status
                });
            }
            
            // Lấy package từ đơn hàng
            packageIdToUse = order.packageId;
            gymPackage = await Package.findById(packageIdToUse);
            if (!gymPackage) {
                return res.status(404).json({ message: "Package in order not found" });
            }
            
            console.log('Found package from order:', gymPackage.name);
        } else {
            // Xử lý trường hợp packageId là numeric string hoặc number từ client
            packageIdToUse = isNaN(packageId) ? packageId : String(packageId);
            
            console.log('Looking for package with ID:', packageIdToUse);
            
            // Nếu packageId là số (từ client), tìm kiếm package bằng field khác
            if (!isNaN(packageId)) {
                // Tìm package bằng field "id" thay vì _id
                gymPackage = await Package.findOne({ id: packageIdToUse });
            } else {
                // Tìm theo _id như bình thường
                gymPackage = await Package.findById(packageIdToUse);
            }
            if (!gymPackage) {
                console.error('Package not found with ID:', packageIdToUse);
                return res.status(404).json({ message: "Package not found" });
            }
        }
          console.log('Package found:', gymPackage.name);

        // Xử lý trường hợp userId là email
        let userIdToUse = userId;
        
        // Nếu userId có định dạng email, tìm user theo email
        if (userId.includes('@')) {
            const User = require('../models/User');
            const user = await User.findOne({ email: userId });
            if (user) {
                userIdToUse = user._id;
                console.log(`Found user with email ${userId}, using ID: ${userIdToUse}`);
            } else {
                console.log(`No existing user found with email ${userId}, will create order with email as userId`);
            }        }        // Tạo đơn hàng mới nếu không có sẵn
        if (!order) {
            order = await Order.create({
                userId: userIdToUse,
                packageId: gymPackage._id, // Sử dụng _id của gymPackage đã tìm được
                amount: gymPackage.price,
                status: "pending"
            });
        }

        // Cấu hình VNPay
        const ipAddr = '127.0.0.1';
        const tmnCode = vnp_TmnCode;
        const secretKey = vnp_HashSecret;
        let vnpUrl = vnp_Url;
        const returnUrl = vnp_ReturnUrl;
        const date = new Date();
        const createDate = date.toISOString().replace(/[-T:Z.]/g, '').slice(0, 14);
        const orderIdStr = order._id.toString();
        const txnRef = `${orderIdStr}-${Date.now()}`;
        order.vnp_TxnRef = txnRef;
        await order.save();

        const amount = gymPackage.price * 100; // VNPAY yêu cầu đơn vị là VND * 100
        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': txnRef,
            'vnp_OrderInfo': `Thanh toan goi tap ${gymPackage.name}`,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate
        };
        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        vnp_Params['vnp_SecureHash'] = signed;
        vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
        return res.json({ paymentUrl: vnpUrl});
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Xử lý callback từ VNPAY
exports.vnpayReturn = async (req, res) => {
    try {
        console.log('VNPAY Return received: ', req.query);
        console.log('Headers:', req.headers);
        
        let vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];
        
        // Kiểm tra nếu không có các tham số VNPAY
        if (!secureHash) {
            console.error('Missing vnp_SecureHash');
            return res.status(400).json({
                code: '97',
                message: 'Thiếu thông tin xác thực thanh toán',
                paymentSuccess: false,
                redirectUrl: '/payment'
            });
        }
        
        delete vnp_Params['vnp_SecureHash'];
        vnp_Params = sortObject(vnp_Params);
        const signData = qs.stringify(vnp_Params, { encode: false });
        const hmac = crypto.createHmac("sha512", vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
        
        if (secureHash === signed) {
            // Tìm đơn hàng
            const txnRef = vnp_Params['vnp_TxnRef'];
            console.log('Looking for order with vnp_TxnRef:', txnRef);
            
            const order = await Order.findOne({ vnp_TxnRef: txnRef });
            if (!order) {
                console.error('Order not found with TxnRef:', txnRef);
                return res.status(404).json({ 
                    code: '01', 
                    message: 'Không tìm thấy đơn hàng',
                    paymentSuccess: false,
                    redirectUrl: '/payment'
                });
            }
            
            // Xác định trạng thái thanh toán
            const isPaymentSuccess = vnp_Params['vnp_ResponseCode'] === '00';
            console.log(`Payment ${isPaymentSuccess ? 'successful' : 'failed'} for order ${order._id}`);
            
            // Cập nhật trạng thái đơn hàng
            order.status = isPaymentSuccess ? 'paid' : 'failed';
            order.vnp_TransactionNo = vnp_Params['vnp_TransactionNo'];
            order.vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
            order.vnp_PayDate = vnp_Params['vnp_PayDate'];
            order.vnp_OrderInfo = vnp_Params['vnp_OrderInfo'];
            order.vnp_SecureHash = secureHash;
            await order.save();
            
            // Nếu thanh toán thành công, kích hoạt tài khoản người dùng
            if (isPaymentSuccess) {
                const User = require('../models/User');
                const Package = require('../models/Package');
                
                // Tìm người dùng
                const user = await User.findById(order.userId);
                if (!user) {
                    console.error(`User not found: ${order.userId}`);
                    return res.status(404).json({ 
                        code: '02', 
                        message: 'Không tìm thấy thông tin người dùng',
                        paymentSuccess: isPaymentSuccess,
                        redirectUrl: '/login' // Chuyển hướng về trang đăng nhập
                    });
                }
                
                // Tìm gói tập để lấy thông tin thời hạn
                const gymPackage = await Package.findById(order.packageId);
                if (!gymPackage) {
                    console.error('Package not found:', order.packageId);
                    return res.status(404).json({ 
                        code: '03', 
                        message: 'Không tìm thấy thông tin gói tập',
                        paymentSuccess: isPaymentSuccess,
                        redirectUrl: '/member/profile' // Chuyển hướng về trang hồ sơ
                    });
                }
                
                console.log(`Activating user ${user._id} with package ${gymPackage.name}`);
                
                // Cập nhật trạng thái và thông tin gói tập cho người dùng
                const membershipStart = new Date();
                
                // Tính thời gian kết thúc gói tập
                const membershipExpiry = new Date(membershipStart);
                membershipExpiry.setDate(membershipExpiry.getDate() + (gymPackage.duration || 30));
                
                // Kích hoạt tài khoản và thiết lập thông tin gói tập
                // Đảm bảo memberInfo tồn tại
                if (!user.memberInfo) {
                  user.memberInfo = {};
                }
                
                user.memberInfo.membershipStart = membershipStart;
                user.memberInfo.membershipEnd = membershipExpiry;
                
                await user.save();
                console.log(`User ${user._id} activated successfully!`);
                
                // Tạo JWT token cho người dùng đã kích hoạt
                const jwt = require('jsonwebtoken');
                const jwtSecret = process.env.JWT_SECRET || 'PASSWORDSECRET';
                
                const payload = {
                    user: {
                        id: user._id,
                        email: user.email,
                        role: user.role
                    }
                };
                
                const token = jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
                
                console.log('Generated token for user:', {
                    userId: user._id,
                    email: user.email,
                    role: user.role
                });
                
                // Tạo redirect URL tùy thuộc vào trạng thái
                return res.json({ 
                    code: vnp_Params['vnp_ResponseCode'], 
                    message: 'Thanh toán thành công! Tài khoản của bạn đã được kích hoạt.',
                    paymentSuccess: isPaymentSuccess,
                    redirectUrl: '/member/profile', // Chuyển hướng về trang hồ sơ thành viên
                    token: token, // Trả về token để client lưu vào localStorage
                    userId: user._id.toString(),
                    packageInfo: {
                        name: gymPackage.name,
                        startDate: membershipStart,
                        endDate: membershipExpiry
                    }
                });
            } else {
                // Thanh toán thất bại
                return res.json({ 
                    code: vnp_Params['vnp_ResponseCode'], 
                    message: 'Thanh toán không thành công. Vui lòng thử lại.',
                    paymentSuccess: isPaymentSuccess,
                    redirectUrl: '/payment' // Chuyển hướng về trang thanh toán
                });
            }
        } else {
            console.error('Payment verification failed: checksum mismatch');
            return res.status(400).json({ 
                code: '97', 
                message: 'Xác thực thanh toán thất bại',
                redirectUrl: '/login'
            });
        }
    } catch (error) {
        console.error('VNPay Return Error:', error);
        return res.status(500).json({ 
            code: '99', 
            message: 'Lỗi xử lý thanh toán',
            redirectUrl: '/login'
        });
    }
}
;

function sortObject(obj) {
    var sorted = {};
    var str = [];
    var key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        var k = str[key];
        sorted[k] = encodeURIComponent(obj[decodeURIComponent(k)]).replace(/%20/g, "+");
    }
    return sorted;
}

// Tạo đơn hàng cho thanh toán thủ công (banking, momo)
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
