import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import Button from '../../../components/common/Button/Button';
import PasswordField from '../../../components/common/PasswordField/PasswordField';
import styles from './ChangePasswordPage.module.css';
import axios from '../../../utils/axiosConfig';

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8001/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      }

      if (data.success) {
        setSuccess(true);
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi đổi mật khẩu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Đổi mật khẩu</h1>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          {success && (
            <div className={styles.successMessage}>
              Đổi mật khẩu thành công!
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.formGroup}>
              <PasswordField
                id="currentPassword"
                name="currentPassword"
                label="Mật khẩu hiện tại"
                value={formData.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
                required={true}
              />
            </div>

            <div className={styles.formGroup}>
              <PasswordField
                id="newPassword"
                name="newPassword"
                label="Mật khẩu mới"
                value={formData.newPassword}
                onChange={handleChange}
                error={errors.newPassword}
                required={true}
              />
            </div>

            <div className={styles.formGroup}>
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                label="Xác nhận mật khẩu mới"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                required={true}
              />
            </div>

            <div className={styles.formActions}>
              <Button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
              </Button>
              <Button
                type="button"
                className={styles.cancelButton}
                onClick={() => navigate('/')}
                disabled={loading}
              >
                Hủy
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ChangePasswordPage;