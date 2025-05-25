import { useSelector, useDispatch } from 'react-redux';
import { setLogin, setLogout } from '../redux/slices/authSlice';
import { store } from '../redux/store';

/**
 * Redux auth hook đơn giản hơn, trực tiếp sử dụng Redux thay vì tương thích với AuthContext
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoggedIn } = useSelector(state => state.auth);

  const login = (userData, authToken) => {
    // Lưu vào localStorage
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    dispatch(setLogin({
      user: userData,
      token: authToken
    }));
  };

  const logout = () => {
    dispatch(setLogout());
  };

  return {
    user,
    token,
    isLoggedIn,
    login,
    logout
  };
};

/**
 * Helper function to convert a user object to the format expected by Redux
 */
export const formatUserForRedux = (user) => {
  return {
    ...user,
    // Add any necessary transformations here
    role: user.role || 'member' // Ensure role exists for PrivateRoute
  };
};

/**
 * Kiểm tra xem người dùng đã đăng nhập hay chưa bằng cách kiểm tra localStorage
 * Nếu có token và thông tin user trong localStorage, dispatch action setLogin để cập nhật Redux store
 */
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  
  if (token && userString) {
    try {
      const user = JSON.parse(userString);
      store.dispatch(setLogin({ user, token }));
      return true;
    } catch (error) {
      console.error('Lỗi khi phân tích thông tin người dùng:', error);
      // Xóa dữ liệu không hợp lệ
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
  return false;
};