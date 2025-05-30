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
    // Kiểm tra cả hai loại token có thể được lưu trữ
    const token = storeToken || localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (token) {
      console.log('Adding token to request headers');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log('No token found in localStorage');
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
    // Chỉ đăng xuất khi token không hợp lệ hoặc hết hạn (401)
    if (error.response && error.response.status === 401) {
      console.log('Phiên đăng nhập hết hạn hoặc không hợp lệ');
      
      // Kiểm tra xem lỗi có phải do token không hợp lệ không
      const errorMessage = error.response.data?.message || '';
      if (errorMessage.includes('Token không hợp lệ') || 
          errorMessage.includes('không có token')) {
        // Đăng xuất người dùng
        store.dispatch(setLogout());
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
