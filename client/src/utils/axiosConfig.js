import axios from 'axios';

// Cấu hình mặc định cho axios
axios.defaults.baseURL = 'http://localhost:8001';

// Thêm interceptor để tự động thêm token vào header
axios.interceptors.request.use(
  config => {
    // Kiểm tra cả hai loại token có thể được lưu trữ
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      console.log('Adding token to request headers');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Thêm interceptor phản hồi để ghi log các lỗi
axios.interceptors.response.use(
  response => {
    // Xử lý phản hồi thành công
    return response;
  },
  error => {
    // Ghi log các lỗi
    if (error.response) {
      // Máy chủ trả về mã trạng thái nằm ngoài phạm vi 2xx
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      // Yêu cầu được tạo nhưng không nhận được phản hồi
      console.error('Request error (no response):', error.request);
    } else {
      // Có lỗi khi thiết lập yêu cầu
      console.error('Error setting up request:', error.message);
    }
    return Promise.reject(error);
  }
);

export default axios;
