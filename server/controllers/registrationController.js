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
    const { account, personal, packageInfo, trainer } = req.body;
    
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
    const packageId = packageInfo._id;
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
    const membershipStartDate = new Date();
    const membershipExpiryDate = new Date(membershipStartDate);
    membershipExpiryDate.setDate(membershipExpiryDate.getDate() + (gymPackage.duration || 30));

    const membershipHistory = await MembershipHistory.create({
      userId: newUser._id,
      packageId: gymPackage._id,
      trainerId: trainer?.id || null,
      startDate: membershipStartDate,
      endDate: membershipExpiryDate,
      status: "Chờ kích hoạt",
    });

    const order = await Order.create({
      userId: newUser._id,
      packageId: gymPackage._id,
      trainerId: trainer?.id || null, // Store selected trainer ID
      registedPackageId: membershipHistory._id, // Reference to MembershipHistory
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
    let session;
    const MAX_RETRIES = 3; // Số lần thử lại tối đa
    let attempts = 0;

    while (attempts < MAX_RETRIES) {
        attempts++;
        try {
            session = await mongoose.startSession();
            session.startTransaction();

            const { txnRef, responseCode } = req.body;
            const userId = req.user.id;

            // Validate payment response
            if (responseCode !== '00') {
                await session.abortTransaction(); // Abort if invalid
                return res.status(400).json({
                    success: false,
                    message: 'Mã phản hồi thanh toán không hợp lệ'
                });
            }

            // First find the order (TRUYỀN SESSION VÀO ĐÂY)
            const order = await Order.findOne({ vnp_TxnRef: txnRef }).session(session);
            if (!order) {
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy đơn hàng với mã giao dịch này'
                });
            }

            // Then find related data (TRUYỀN SESSION VÀO ĐÂY)
            const [user, gymPackage, resisteredPackage] = await Promise.all([
                User.findById(userId).session(session),
                Package.findById(order.packageId).session(session),
                MembershipHistory.findById(order.registedPackageId).session(session)
            ]);

            // Validate required data exists
            if (!user || !gymPackage || !resisteredPackage) {
                await session.abortTransaction();
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy thông tin tài khoản hoặc gói tập'
                });
            }
            console.log("==============Kiểm tra thông tin người dùng================");
            console.log(resisteredPackage);

            // Check if order is already paid (TRUYỀN SESSION VÀO ĐÂY)
            if (order.status === 'paid') {
                const existingHistory = await MembershipHistory.findOne({
                    _id: order.registedPackageId,
                    userId: user._id,
                }).session(session); // Đảm bảo query này cũng dùng session

                await session.abortTransaction();
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
                        },
                        trainerId: existingHistory?.trainerId || order.trainerId || null
                    }
                });
            }

            // Calculate membership dates
            let membershipStartDate = new Date();
            let membershipExpiryDate = new Date(membershipStartDate);
            membershipExpiryDate.setDate(membershipExpiryDate.getDate() + (gymPackage.duration || 30));

            // Check for existing active membership (TRUYỀN SESSION VÀO ĐÂY)
            const existingResiteredPackage = await MembershipHistory.findOne({
                _id: order.registedPackageId
            }).session(session);
            console.log("==============Kiểm tra gói tập đã đăng ký================");
            console.log(existingResiteredPackage);
            // Handle membership renewal
            if (existingResiteredPackage) {
                if (existingResiteredPackage.status === 'Chờ kích hoạt') {
                    console.log("==============Kích hoạt gói tập mới================");
                    // Update existing package to active status
                    existingResiteredPackage.status = 'Đã kích hoạt';
                    await existingResiteredPackage.save({ session });
                } else if (existingResiteredPackage.status === 'Đã kích hoạt') {
                    console.log("==============Gia hạn gói tập đang hoạt động================");
                    // Khi gia hạn, bắt đầu từ ngày kết thúc của gói hiện tại
                    membershipStartDate = new Date(existingResiteredPackage.endDate);
                    membershipExpiryDate = new Date(membershipStartDate);
                    membershipExpiryDate.setDate(membershipExpiryDate.getDate() + (gymPackage.duration || 30));

                    existingResiteredPackage.endDate = membershipExpiryDate;
                    await existingResiteredPackage.save({ session });
                }
            }

            // Update user membership info
            user.memberInfo = {
                ...user.memberInfo,
                membershipStart: membershipStartDate,
                membershipEnd: membershipExpiryDate
            };
            await user.save({ session });

            // Update order status
            order.status = 'paid';
            await order.save({ session });

            // Commit transaction
            await session.commitTransaction();
            console.log(`User ${user._id} activated successfully`);

            // Trả về response thành công
            return res.json({
                success: true,
                message: 'Đăng kí hoặc gia hạn gói tập thành công',
                user: {
                    id: user._id,
                    email: user.email,
                    membershipStart: membershipStartDate,
                    membershipEnd: membershipExpiryDate,
                    packageInfo: {
                        id: gymPackage._id,
                        name: gymPackage.name
                    },
                    trainerId: order.trainerId
                }
            });

        } catch (error) {
            if (session) {
                await session.abortTransaction();
            }

            // Kiểm tra nếu lỗi là WriteConflict hoặc TransientTransactionError
            if (error.code === 112 || (error.errorLabels && error.errorLabels.includes('TransientTransactionError'))) {
                console.warn(`Write conflict detected, retrying transaction. Attempt ${attempts} of ${MAX_RETRIES}`);
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 50)); // Exponential backoff
                continue; // Thử lại toàn bộ giao dịch
            } else {
                // Đây là một lỗi không phải write conflict, hoặc đã hết số lần thử lại
                console.error('Error activating account after payment:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Đã xảy ra lỗi khi kích hoạt tài khoản'
                });
            }
        } finally {
            if (session) {
                await session.endSession();
            }
        }
    }

    // Nếu vòng lặp kết thúc mà vẫn chưa thành công
    return res.status(500).json({
        success: false,
        message: 'Đã xảy ra lỗi khi kích hoạt tài khoản do xung đột đồng thời không thể giải quyết.'
    });
};