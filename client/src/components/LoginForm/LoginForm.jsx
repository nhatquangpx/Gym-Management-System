import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import InputField from '../InputField/InputField';
import PasswordField from '../PasswordField/PasswordField';
import Button from '../Button/Button';
import GoogleButton from '../GoogleButton/GoogleButton';
import Divider from '../Divider/Divider';

const LoginForm = () => {
  const navigate = useNavigate();
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined
      });
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
      // Handle login logic here
      console.log('Form submitted:', formData);
      // Sau khi đăng nhập thành công, chuyển hướng đến trang dashboard
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    // Handle Google login logic here
    console.log('Google login clicked');
    // Sau khi đăng nhập Google thành công, chuyển hướng đến trang dashboard
    navigate('/dashboard');
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
        <a href="#" className={styles.forgotPassword}>Quên mật khẩu?</a>
      </div>

      <Button type="submit" className={styles.loginBtn}>
        Đăng nhập
      </Button>

      <Divider text="hoặc" />

      {/* GoogleButton ở đây vẫn giữ text mặc định */}
      <GoogleButton onClick={handleGoogleLogin} /> 

      <div className={styles.registerLink}>
        Chưa có tài khoản? <a href="#" onClick={e => { e.preventDefault(); navigate('/register/package'); }}>Đăng ký ngay</a>
      </div>
    </form>
  );
};

export default LoginForm;