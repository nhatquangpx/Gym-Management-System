import axios from 'axios';
import { store } from '../redux/store';
import { setLogout } from '../redux/slices/authSlice';

// Cấu hình mặc định cho axios
axios.defaults.baseURL = 'http://localhost:8001';

// Thêm interceptor để tự động thêm token vào header
axios.interceptors.request.use(
  config => {
    // Ưu tiên lấy token từ Redux store
    const storeToken = store.getState().auth.token;
    // Fallback về localStorage nếu không có token trong store
    const token = storeToken || localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý lỗi xác thực
axios.interceptors.response.use(
  response => response,
  error => {
    // Nếu server trả về lỗi 401 Unauthorized hoặc 403 Forbidden, 
    // có thể token đã hết hạn hoặc không hợp lệ
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.log('Phiên đăng nhập hết hạn hoặc không hợp lệ');
      
      // Kiểm tra xem lỗi có phải do token không hợp lệ không
      const errorMessage = error.response.data?.message || '';
      if (errorMessage.includes('Token không hợp lệ') || 
          errorMessage.includes('không có token') ||
          errorMessage.includes('không có quyền')) {
        // Đăng xuất người dùng
        store.dispatch(setLogout());
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
