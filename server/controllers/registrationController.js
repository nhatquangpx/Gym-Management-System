const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const Package = require("../models/Package");
const Order = require("../models/Order");
const MembershipHistory = require("../models/MembershipHistory");

// @route   POST /api/registration/register-member
// @desc    Đăng ký thành viên mới và tạo đơn hàng gói tập
// @access  Public
// @note    This function handles new user registration with a package.
//          For existing member package registration, see memberController.js
exports.registerMember = async (req, res) => {
  try {
    const { account, personal, packageInfo } = req.body;
    
    // 1. Kiểm tra dữ liệu đầu vào
    if (!account || !account.email || !account.password || !packageInfo || !packageInfo.id) {
      return res.status(400).json({ 
        success: false, 
        message: "Thiếu thông tin cần thiết để đăng ký" 
      });
    }

    // 2. Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email: account.email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: "Email này đã được đăng ký, vui lòng sử dụng email khác hoặc đăng nhập" 
      });
    }

    // 3. Tìm gói tập
    const packageId = packageInfo.id || packageInfo._id;
    let gymPackage = null;
    
    if (!isNaN(packageId)) {
      // Tìm package bằng field "id"
      gymPackage = await Package.findOne({ id: String(packageId) });
    } else {
      // Tìm theo _id
      gymPackage = await Package.findById(packageId);
    }
    
    if (!gymPackage) {
      return res.status(404).json({ 
        success: false, 
        message: "Không tìm thấy gói tập" 
      });
    }

    // 4. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(account.password, salt);

    // 5. Tạo user mới (member) - ở trạng thái chờ kích hoạt
    const newUser = new User({
      name: personal.fullName || account.email.split('@')[0],
      email: account.email,
      password: hashPassword,
      phone: account.phone || '',
      role: "member",
      // Thêm thông tin cá nhân vào memberInfo theo đúng schema
      memberInfo: {
        gender: personal.gender || '',
        dateOfBirth: personal.birthDate || null,
        address: personal.address || '',
        job: personal.occupation || '',
        // Thông tin bổ sung - sẽ được kích hoạt sau khi thanh toán
        membershipStart: null,
        membershipEnd: null
      }
    });

    // 6. Lưu user mới vào database
    await newUser.save();
    console.log(`User registered: ${newUser.email} (${newUser._id})`);
    
    // 7. Tạo JWT cho người dùng mới
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 8. Tạo đơn hàng thanh toán với userId chính thức
    const order = await Order.create({
      userId: newUser._id,
      packageId: gymPackage._id,
      amount: gymPackage.price,
      status: "pending",
      orderInfo: `Đăng ký gói tập ${gymPackage.name} cho thành viên mới`
    });
    console.log(`Order created for new member: ${order._id}`);
    
    // 9. Trả về thông tin người dùng, token và đơn hàng
    res.status(201).json({
      success: true,
      message: "Đăng ký thành công! Tiếp tục để hoàn tất thanh toán.",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        },
        order: {
          orderId: order._id,
          packageName: gymPackage.name,
          amount: gymPackage.price,
          status: order.status
        },
        token
      }
    });
  } catch (error) {
    console.error('Register Member Error:', error);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi server: " + error.message 
    });
  }
};

// @route   POST /api/registration/activate-after-payment
// @desc    Kích hoạt tài khoản user sau khi đã thanh toán thành công
// @access  Private - Yêu cầu JWT
exports.activateAfterPayment = async (req, res) => {
  try {
    const { txnRef, responseCode } = req.body;
    const userId = req.user.id;
    
    console.log(`Attempting to activate account after payment: User=${userId}, TxnRef=${txnRef}, Code=${responseCode}`);
    
    // Chỉ kích hoạt nếu mã phản hồi là '00' (thành công)
    if (responseCode !== '00') {
      return res.status(400).json({
        success: false,
        message: 'Mã phản hồi thanh toán không hợp lệ'
      });
    }
    
    // Tìm đơn hàng dựa trên txnRef
    const order = await Order.findOne({ vnp_TxnRef: txnRef });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng với mã giao dịch này'
      });
    }
    
    // Tìm user từ JWT token
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin tài khoản'
      });
    }
      // Tìm thông tin gói tập
    const gymPackage = await Package.findById(order.packageId);
    if (!gymPackage) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông tin gói tập'
      });
    }

    // Nếu đơn hàng đã thanh toán rồi thì không cần làm gì thêm
    if (order.status === 'paid') {
      // Lấy membership history cho user này
      const existingHistory = await MembershipHistory.findOne({ 
        userId: user._id,
        orderId: order._id
      });
      
      return res.json({
        success: true,
        message: 'Đơn hàng này đã được thanh toán trước đó',
        user: {
          id: user._id,
          email: user.email,
          membershipStart: user.memberInfo?.membershipStart,
          membershipEnd: user.memberInfo?.membershipEnd,
          packageInfo: {
            id: gymPackage._id,
            name: gymPackage.name
          }
        }
      });
    }
      // Kích hoạt tài khoản và thiết lập thông tin gói tập
    const membershipStart = new Date();
    const membershipExpiry = new Date(membershipStart);
    membershipExpiry.setDate(membershipExpiry.getDate() + (gymPackage.duration || 30));

    // Kiểm tra có phải là gia hạn không
    let isRenewing = false;
    let membershipStartDate = membershipStart;
    let membershipExpiryDate = membershipExpiry;

    // Kiểm tra membership cũ cùng packageId
    const existingMembership = await MembershipHistory.findOne({
      userId: user._id, 
      packageId: gymPackage._id
    }).sort({ endDate: -1 });

    // Nếu đang gia hạn, sử dụng endDate cũ làm startDate mới
    if (existingMembership) {
      isRenewing = true;
      membershipStartDate = new Date(existingMembership.endDate);
      membershipExpiryDate = new Date(membershipStartDate);
      membershipExpiryDate.setDate(membershipExpiryDate.getDate() + (gymPackage.duration || 30));
    }
    
    // Cập nhật thông tin gói tập vào memberInfo
    if (!user.memberInfo) {
      user.memberInfo = {};
    }
    user.memberInfo.membershipStart = membershipStartDate;
    user.memberInfo.membershipEnd = membershipExpiryDate;
    
    // Sử dụng MongoDB session để đảm bảo tính atomic cho toàn bộ quá trình
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // 1. Cập nhật user với thông tin membership mới
      await user.save({ session });
      
      // 2. Cập nhật trạng thái đơn hàng
      order.status = 'paid';
      await order.save({ session });
        // 3. Kiểm tra có phải gia hạn gói tập (renewal) không
      // Tìm MembershipHistory gần nhất với cùng packageId và userId
      let existingMembership = await MembershipHistory.findOne({
        userId: user._id, 
        packageId: gymPackage._id
      }).sort({ endDate: -1 });
      
      let isRenewal = false;
      let renewalType = "new";
      let membershipStartDate = membershipStart;
      let membershipExpiryDate = membershipExpiry;
      
      // Nếu tìm thấy membership cũ cùng packageId, thì đây là gia hạn
      if (existingMembership) {
        isRenewal = true;
        renewalType = "renew";
        // Lấy endDate từ membership cũ làm startDate cho membership mới
        membershipStartDate = new Date(existingMembership.endDate);
        // Tính lại ngày hết hạn mới
        membershipExpiryDate = new Date(membershipStartDate);
        membershipExpiryDate.setDate(membershipExpiryDate.getDate() + (gymPackage.duration || 30));
      }
      
      // Tạo bản ghi MembershipHistory trong cùng transaction
      const membershipHistory = new MembershipHistory({
        userId: user._id,
        packageId: gymPackage._id,
        orderId: order._id,
        startDate: membershipStartDate,
        endDate: membershipExpiryDate,
        renewalType: renewalType,
      });
      
      await membershipHistory.save({ session });
      
      // Commit transaction
      await session.commitTransaction();
      session.endSession();
      console.log(`User ${user._id} activated with MembershipHistory successfully via atomic transaction`);
    } catch (error) {
      // Nếu có lỗi, rollback toàn bộ transaction
      await session.abortTransaction();
      session.endSession();
      
      // Nếu là lỗi duplicate key và đơn hàng thực sự đã được xử lý trước đó
      if (error.code === 11000) {
        console.log(`Possible race condition detected for order: ${order._id}, checking status`);
        
        // Kiểm tra trạng thái thực tế của order
        const updatedOrder = await Order.findById(order._id);
        
        if (updatedOrder && updatedOrder.status === 'paid') {
          console.log(`Order ${order._id} was processed by another request`);
          
          return res.json({
            success: true,
            message: 'Đơn hàng đã được xử lý bởi request khác',
            user: {
              id: user._id,
              email: user.email,
              membershipStart: user.memberInfo.membershipStart,
              membershipEnd: user.memberInfo.membershipEnd,
              packageInfo: {
                id: gymPackage._id,
                name: gymPackage.name
              }
            }
          });
        }
      }
      
      // Nếu là lỗi khác, throw để catch bên ngoài xử lý
      throw error;
    }
    
    console.log(`User ${user._id} activated successfully via client-side activation`);
    
    // Trả về thông tin thành công
    return res.json({
      success: true,
      message: 'Tài khoản đã được kích hoạt thành công',
      user: {
        id: user._id,
        email: user.email,
        membershipStart: user.memberInfo.membershipStart,
        membershipEnd: user.memberInfo.membershipEnd,
        packageInfo: {
          id: gymPackage._id,
          name: gymPackage.name
        }
      }
    });
  } catch (error) {
    console.error('Error activating account after payment:', error);
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi kích hoạt tài khoản'
    });
  }
};