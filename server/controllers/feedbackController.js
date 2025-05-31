const Feedback = require('../models/Feedback');
const Package = require('../models/Package');
const User = require('../models/User');
const Order = require('../models/Order');
const Schedule = require('../models/Schedule');

// Lấy danh sách gói tập đã dùng
exports.getUsedPackages = async (req, res) => {
  try {
    const userId = req.user.id;
    // Lấy các order của user hiện tại
    const orders = await Order.find({ userId }).populate('packageId');
    // Lọc ra các packageId hợp lệ
    const packages = orders
      .filter(o => o.packageId && o.packageId._id)
      .map(o => ({
        _id: o.packageId._id,
        name: o.packageId.name
      }));
    // Loại trùng
    const uniquePackages = Array.from(new Map(packages.map(p => [p._id.toString(), p])).values());
    res.json({ success: true, data: uniquePackages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy gói tập đã dùng', error: error.message });
  }
};

// Lấy danh sách huấn luyện viên đã từng tập
exports.getUsedTrainers = async (req, res) => {
  try {
    const userId = req.user.id;
    // Lấy các lịch tập có trainer
    const schedules = await Schedule.find({ memberId: userId, trainerId: { $ne: null } }).populate('trainerId', 'name');
    const trainers = schedules
      .filter(s => s.trainerId)
      .map(s => ({ _id: s.trainerId._id, name: s.trainerId.name }));
    // Loại trùng
    const uniqueTrainers = Array.from(new Map(trainers.map(t => [t._id.toString(), t])).values());
    res.json({ success: true, data: uniqueTrainers });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy HLV đã tập', error: error.message });
  }
};

// Gửi feedback
exports.createFeedback = async (req, res) => {
  try {
    const { type, star, text, targetId } = req.body;
    const memberId = req.user.id;
    let targetName = '';
    // Kiểm tra targetId có hợp lệ không
    if (type === 'Gói tập') {
      const order = await Order.findOne({ userId: memberId, packageId: targetId, status: "paid" }).populate('packageId');
      if (!order) return res.status(400).json({ success: false, message: 'Bạn chưa từng sử dụng gói này' });
      targetName = order.packageId.name;
    } else if (type === 'Huấn luyện viên') {
      const schedule = await Schedule.findOne({ memberId, trainerId: targetId }).populate('trainerId');
      if (!schedule) return res.status(400).json({ success: false, message: 'Bạn chưa từng tập với HLV này' });
      targetName = schedule.trainerId.name;
    }
    const feedback = new Feedback({ memberId, type, star, text, targetName });
    await feedback.save();
    res.status(201).json({ success: true, message: 'Gửi đánh giá thành công', data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi gửi đánh giá', error: error.message });
  }
};

// Lấy lịch sử feedback
exports.getFeedbackHistory = async (req, res) => {
  try {
    const memberId = req.user.id;
    const { type } = req.query;
    let query = { memberId };
    if (type && type !== 'Tất cả') query.type = type;
    const feedbacks = await Feedback.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi lấy lịch sử đánh giá', error: error.message });
  }
};

// Lấy tất cả feedback (cho admin/staff)
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }).populate('memberId', 'name');
    const feedbackList = feedbacks.map(fb => ({
      ...fb.toObject(),
      memberName: fb.memberId?.name || ''
    }));
    res.json({ success: true, data: feedbackList });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách feedback', error: error.message });
  }
};

// Lấy chi tiết 1 feedback (cho admin/staff)
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id).populate('memberId', 'name');
    if (!feedback) return res.status(404).json({ success: false, message: 'Không tìm thấy feedback' });
    const feedbackObj = feedback.toObject();
    feedbackObj.memberName = feedback.memberId?.name || '';
    res.json({ success: true, data: feedbackObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi lấy chi tiết feedback', error: error.message });
  }
};

//Xóa feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Không tìm thấy feedback' });
    res.json({ success: true, message: 'Feedback đã được xóa' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi khi xóa feedback', error: error.message });
  }
};
