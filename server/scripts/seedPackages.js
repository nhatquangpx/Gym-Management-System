// Thêm các gói tập mẫu vào cơ sở dữ liệu
require('dotenv').config();
const mongoose = require('mongoose');
const Package = require('../models/Package');

// Kết nối đến cơ sở dữ liệu
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    // Sử dụng MONGO_URL thay vì MONGO_URI để phù hợp với cấu hình chung
    console.log('MONGO_URL available:', !!process.env.MONGO_URL);
    
    // Sử dụng URI mặc định nếu không tìm thấy trong .env
    const mongoUri = process.env.MONGO_URL || 'mongodb://localhost:27017/GymManagement';
    
    console.log('Using MongoDB URI:', mongoUri);
    const conn = await mongoose.connect(mongoUri, {
      dbName: "GymManagement"
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('Full error:', error);
    process.exit(1);
  }
};

// Dữ liệu gói tập
const packages = [
  {
    id: "1",
    name: "Gói Basic",
    price: 500000,
    period: "/tháng",
    type: "Tự tập",
    description: "Gói tập cơ bản dành cho người mới bắt đầu",
    features: [
      "Sử dụng tất cả các thiết bị",
      "Tập không giới hạn thời gian",
      "Tủ khóa cá nhân",
      "Phòng tắm",
      "Nước uống miễn phí",
      "Khăn tập"
    ],
    duration: 30
  },
  {
    id: "2",
    name: "Gói Premium",
    price: 1200000,
    period: "/tháng",
    type: "Tập với PT",
    description: "Gói tập nâng cao với PT hướng dẫn",
    features: [
      "Tất cả quyền lợi của gói Basic",
      "12 buổi tập với PT/tháng",
      "Lịch tập cá nhân hóa",
      "Tư vấn dinh dưỡng",
      "Đánh giá thể chất định kỳ",
      "Ưu tiên đặt lịch"
    ],
    duration: 30
  },
  {
    id: "3",
    name: "Gói VIP",
    price: 2000000,
    period: "/tháng",
    type: "Tập với PT",
    description: "Gói tập cao cấp với chế độ chăm sóc toàn diện",
    features: [
      "Tất cả quyền lợi của gói Premium",
      "24 buổi tập với PT/tháng", 
      "Chế độ dinh dưỡng theo tuần",
      "Đo chỉ số cơ thể định kỳ",
      "Tư vấn 24/7",
      "Đồ uống protein sau tập"
    ],
    duration: 30
  }
];

// Hàm tạo gói tập
const seedPackages = async () => {
  try {
    await connectDB();
    
    // Xóa các gói tập hiện có (tùy chọn)
    // Nếu chỉ muốn thêm mới mà không xóa dữ liệu cũ, hãy comment dòng này
    await Package.deleteMany(); 
    
    console.log('Đã xóa các gói tập hiện có');
    
    // Tạo các gói tập mới
    const createdPackages = await Package.insertMany(packages);
    
    console.log(`Đã tạo ${createdPackages.length} gói tập:`);
    createdPackages.forEach(pkg => {
      console.log(`- ${pkg.name}: ${pkg.price}đ (${pkg._id})`);
    });
    
    console.log('Hoàn tất thêm các gói tập!');
    process.exit();
  } catch (error) {
    console.error(`Lỗi: ${error.message}`);
    process.exit(1);
  }
};

// Chạy script
seedPackages();
