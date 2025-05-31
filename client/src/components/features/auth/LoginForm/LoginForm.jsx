import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../../../redux/slices/authSlice';
import styles from './LoginForm.module.css';
import InputField from '../../../common/InputField/InputField';
import PasswordField from '../../../common/PasswordField/PasswordField';
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

      <PasswordField
        id="password"
        name="password"
        label="Mật khẩu"
        placeholder="Nhập mật khẩu"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        required={true}
      />

      <div className={styles.formOptions}>
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
    </form>
  );
};

export default LoginForm;