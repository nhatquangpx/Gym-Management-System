import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterAccountPage.module.css';
import InputField from '../../../components/common/InputField/InputField';
import PasswordField from '../../../components/common/PasswordField/PasswordField';
import Button from '../../../components/common/Button/Button';
import Divider from '../../../components/common/Divider/Divider';
import GoogleButton from '../../../components/common/GoogleButton/GoogleButton';

const RegisterAccount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [registrationData, setRegistrationData] = useState({});
  
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (location.state) {
      setRegistrationData(location.state);
    } else {
      navigate('/register/package');
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    }

    // Kiểm tra số điện thoại
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại phải có 10 chữ số';
      isValid = false;
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      isValid = false;
    }

    // Kiểm tra xác nhận mật khẩu
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
      isValid = false;
    } else if (formData.password && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      navigate('/register/personal', {
        state: { ...registrationData, account: formData }
      });
    }
  };

  const handleBack = () => {
    if (registrationData.trainer) {
      navigate('/register/pt', { state: { package: registrationData.package } });
    } else {
      navigate('/register/package');
    }
  };

  const handleGoogleRegister = () => {
    console.log('Đăng ký với Google');
    navigate('/register/personal', {
      state: {
        ...registrationData,
        account: {
          email: 'example@gmail.com', 
          phone: '', 
          googleAuth: true
        }
      }
    });
  };

  return (
    <div className={styles.pageContainer}> 
      <div className={styles.contentWrapper}> 
        <div className={styles.header}>
        <h2>Thông Tin Tài Khoản</h2>
        <p>Nhập thông tin để tạo tài khoản</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="Nhập email của bạn"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
            required={true}
        />

        <InputField
          id="phone"
          label="Số điện thoại"
          type="tel"
          placeholder="Nhập số điện thoại của bạn"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
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

        <PasswordField
          id="confirmPassword"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
            required={true}
        />

        <div className={styles.buttonGroup}>
            <Button 
            type="button"
            className={styles.backButton}
            onClick={handleBack}
          >
            Quay lại
          </Button>
            <Button 
            type="submit"
            className={styles.continueButton}
          >
            Tiếp tục
          </Button>
        </div>

        <Divider text="hoặc" />

          <GoogleButton onClick={handleGoogleRegister} text="Đăng ký với Google" /> 
      </form>
      </div>
    </div>
  );
};

export default RegisterAccount;
