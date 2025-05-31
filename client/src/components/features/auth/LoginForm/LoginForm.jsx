import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../../redux/slices/authSlice';
import styles from './LoginForm.module.css';
import InputField from '../../../common/InputField/InputField';
import Button from '../../../common/Button/Button';
import Divider from '../../../common/Divider/Divider';
import GoogleButton from '../../../common/GoogleButton/GoogleButton';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setLoading(true);
      setLoginError('');
      
      try {
        // Gọi API đăng nhập
        const response = await fetch(`http://localhost:8001/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Đăng nhập thất bại');
        }
        
        // Lưu token vào localStorage nếu chọn "Ghi nhớ đăng nhập"
        if (formData.rememberMe) {
          localStorage.setItem('token', data.token);
        }
        
        // Dispatch action lưu thông tin người dùng vào Redux store
        dispatch(setLogin({
          user: data.user,
          token: data.token
        }));
        
        // Chuyển hướng dựa vào role
        if (data.user.role) {
            navigate('/'); // Member về trang chủ
        }
      } catch (error) {
        console.error('Login error:', error);
        setLoginError(error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin đăng nhập.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = () => {
    // Giả lập đăng nhập Google
    const mockGoogleUser = {
      name: "Google User",
      email: "google.user@gmail.com",
      avatar: "https://i.pravatar.cc/150?img=4",
      role: "member"  // Add a role for PrivateRoute
    };
    
    // Dispatch action to Redux store
    dispatch(setLogin({
      user: mockGoogleUser,
      token: "mock-google-token-for-testing"
    }));
    
    navigate('/');
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
      {loginError && (
        <div className={styles.errorMessage}>
          {loginError}
        </div>
      )}
      
      <InputField
        id="email"
        name="email"
        label="Email"
        type="email"
        placeholder="Nhập email của bạn"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required={true}
      />

      <InputField
        id="password"
        name="password"
        label="Mật khẩu"
        type="password"
        placeholder="Nhập mật khẩu"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required={true}
      />

      <div className={styles.formOptions}>
        <label className={styles.rememberMe}>
          <input
            type="checkbox"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>
        <Link to="/forgot-password" className={styles.forgotPassword}>
          Quên mật khẩu?
        </Link>
      </div>

      <Button 
        type="submit" 
        className={styles.loginBtn}
        disabled={loading}
      >
        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
      </Button>

      <Divider text="hoặc" />

      <GoogleButton onClick={handleGoogleLogin} text="Đăng nhập với Google" />

      <div className={styles.registerLink}>
        Chưa có tài khoản? <Link to="/register/package">Đăng ký ngay</Link>
      </div>
    </form>
  );
};

export default LoginForm;