import { useState, useRef } from 'react';
import styles from './ChangePasswordPage.module.css';

const ChangePasswordPage = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Refs để focus vào input lỗi đầu tiên
  const currentPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
    if (successMessage) setSuccessMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
      isValid = false;
    }

    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
      isValid = false;
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
      isValid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
      isValid = false;
    } else if (formData.confirmPassword !== formData.newPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
      isValid = false;
    }

    setErrors(newErrors);
    // Focus vào input lỗi đầu tiên
    setTimeout(() => {
      if (newErrors.currentPassword && currentPasswordRef.current) currentPasswordRef.current.focus();
      else if (newErrors.newPassword && newPasswordRef.current) newPasswordRef.current.focus();
      else if (newErrors.confirmPassword && confirmPasswordRef.current) confirmPasswordRef.current.focus();
    }, 0);
    
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      
      // Mô phỏng call API 
      setTimeout(() => {
        setSuccessMessage('Mật khẩu đã được cập nhật thành công!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleCancel = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Đổi Mật Khẩu</h1>
        <p className={styles.subtitle}>Cập nhật mật khẩu cho tài khoản của bạn</p>
        
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label htmlFor="currentPassword" className={styles.label}>Mật khẩu hiện tại <span className={styles.requiredStar}>*</span></label>
            <div className={styles.passwordWrapper}>
              <input
                id="currentPassword"
                className={styles.input}
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu hiện tại"
                ref={currentPasswordRef}
                autoComplete="off"
              />
            </div>
            {errors.currentPassword && <div className={styles.error}>{errors.currentPassword}</div>}
          </div>
          
          <div>
            <label htmlFor="newPassword" className={styles.label}>Mật khẩu mới <span className={styles.requiredStar}>*</span></label>
            <div className={styles.passwordWrapper}>
              <input
                id="newPassword"
                className={styles.input}
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Nhập mật khẩu mới"
                ref={newPasswordRef}
                autoComplete="off"
              />
            </div>
            {errors.newPassword && <div className={styles.error}>{errors.newPassword}</div>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className={styles.label}>Xác nhận mật khẩu mới <span className={styles.requiredStar}>*</span></label>
            <div className={styles.passwordWrapper}>
              <input
                id="confirmPassword"
                className={styles.input}
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu mới"
                ref={confirmPasswordRef}
                autoComplete="off"
              />
            </div>
            {errors.confirmPassword && <div className={styles.error}>{errors.confirmPassword}</div>}
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancel}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage; 