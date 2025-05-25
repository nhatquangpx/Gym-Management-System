import { useSelector, useDispatch } from 'react-redux';
import { setLogin, setLogout } from '../redux/slices/authSlice';

/**
 * Redux auth hook đơn giản hơn, trực tiếp sử dụng Redux thay vì tương thích với AuthContext
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoggedIn } = useSelector(state => state.auth);

  const login = (userData, authToken) => {
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