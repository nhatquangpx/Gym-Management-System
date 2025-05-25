import axios from 'axios';

// Cấu hình mặc định cho axios
axios.defaults.baseURL = 'http://localhost:8001';

// Thêm interceptor để tự động thêm token vào header
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default axios;
