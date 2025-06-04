import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterAccountPage.module.css';
import InputField from '../../../components/common/InputField/InputField';
import PasswordField from '../../../components/common/PasswordField/PasswordField';
import Button from '../../../components/common/Button/Button';

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

  const validateForm = async () => {
    const newErrors = {};
    let isValid = true;

    // Kiểm tra email
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
      isValid = false;
    } else {
      try {
        // Kiểm tra email đã tồn tại chưa
        const response = await fetch('http://localhost:8001/api/auth/check-existed-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ email: formData.email })
        });
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.message || 'Có lỗi xảy ra khi kiểm tra email');
        }
        
        if (data.exists) {
          newErrors.email = 'Email đã tồn tại';
          isValid = false;
        }
      } catch (error) {
        console.error('Error checking email:', error);
        newErrors.email = error.message || 'Có lỗi xảy ra khi kiểm tra email';
        isValid = false;
      }
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
    return { isValid, errors: newErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Reset errors before validation
    
    const { isValid, errors } = await validateForm();
    
    if (!isValid) {
      // Nếu form không hợp lệ, focus vào trường đầu tiên có lỗi
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
        }
      }
      return; // Dừng việc xử lý form nếu có lỗi
    }

    // Chỉ navigate khi form hợp lệ
    navigate('/register/personal', {
      state: { ...registrationData, account: formData }
    });
  };

  const handleBack = () => {
    if (registrationData.trainer) {
      navigate('/register/pt', { state: { package: registrationData.package } });
    } else {
      navigate('/register/package');
    }
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
      </form>
      </div>
    </div>
  );
};

export default RegisterAccount;
