import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import { useAuth } from '../../contexts/AuthContext';
import InputField from '../InputField/InputField';
import PasswordField from '../PasswordField/PasswordField';
import Button from '../Button/Button';
import Divider from '../Divider/Divider';
import GoogleButton from '../GoogleButton/GoogleButton';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username/Email là bắt buộc';
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Giả lập đăng nhập thành công
      login({
        name: "User Test",
        email: formData.username,
        avatar: "https://i.pravatar.cc/150?img=3"
      });
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    // Giả lập đăng nhập Google
    login({
      name: "Google User",
      email: "google.user@gmail.com",
      avatar: "https://i.pravatar.cc/150?img=4"
    });
    navigate('/');
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit} noValidate>
      <InputField
        id="username"
        label="Username/Email"
        type="text"
        placeholder="Nhập username hoặc email"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required={true}
      />

      <PasswordField
        id="password"
        label="Mật khẩu"
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

      <Button type="submit" className={styles.loginBtn}>
        Đăng nhập
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