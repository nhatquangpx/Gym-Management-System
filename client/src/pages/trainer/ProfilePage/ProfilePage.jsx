import { useState, useRef } from 'react';
import styles from './ProfilePage.module.css';

const ProfilePage = () => {
  // Mock data for trainer profile
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'trainer@example.com',
    phone: '0123456789',
    specialization: 'Strength Training, Cardio',
    type: 'gym',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  // Luôn ở chế độ chỉnh sửa
  const isEditing = true;

  // refs để focus vào input lỗi đầu tiên
  const fullNameRef = useRef();
  const phoneRef = useRef();
  const specializationRef = useRef();

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
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
      isValid = false;
    }
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }
    if (!formData.specialization.trim()) {
      newErrors.specialization = 'Vui lòng nhập chuyên môn của bạn';
      isValid = false;
    }
    setErrors(newErrors);
    // Focus vào input lỗi đầu tiên
    setTimeout(() => {
      if (newErrors.fullName && fullNameRef.current) fullNameRef.current.focus();
      else if (newErrors.phone && phoneRef.current) phoneRef.current.focus();
      else if (newErrors.specialization && specializationRef.current) specializationRef.current.focus();
    }, 0);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditing) return;
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        setSuccessMessage('Cập nhật thông tin thành công!');
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      fullName: 'John Doe',
      email: 'trainer@example.com',
      phone: '0123456789',
      specialization: 'Strength Training, Cardio',
      type: 'gym',
    });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>Thông Tin Cá Nhân</h1>
        <p className={styles.subtitle}>Cập nhật thông tin huấn luyện viên của bạn</p>
        {successMessage && (
          <p className={styles.successMessage}>{successMessage}</p>
        )}
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.formGrid}>
            <div>
              <label htmlFor="fullName" className={styles.label}>Họ và tên <span style={{color: '#e53935'}}>*</span></label>
              <input
                id="fullName"
                className={styles.input}
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                ref={fullNameRef}
                autoComplete="off"
              />
              {errors.fullName && <div className={styles.error}>{errors.fullName}</div>}
            </div>
            <div>
              <label htmlFor="email" className={styles.label}>Email (không thể chỉnh sửa)</label>
              <input
                id="email"
                className={styles.input}
                type="email"
                name="email"
                value={formData.email}
                disabled
                placeholder="Nhập email"
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="phone" className={styles.label}>Số điện thoại</label>
              <input
                id="phone"
                className={styles.input}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                ref={phoneRef}
                autoComplete="off"
              />
              {errors.phone && <div className={styles.error}>{errors.phone}</div>}
            </div>
            <div>
              <label htmlFor="specialization" className={styles.label}>Chuyên môn <span style={{color: '#e53935'}}>*</span></label>
              <input
                id="specialization"
                className={styles.input}
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Nhập chuyên môn (VD: Cardio, Yoga...)"
                ref={specializationRef}
                autoComplete="off"
              />
              {errors.specialization && <div className={styles.error}>{errors.specialization}</div>}
            </div>
            <div style={{gridColumn: '1 / span 2'}}>
              <label htmlFor="type" className={styles.label}>Loại hình huấn luyện</label>
              <select
                id="type"
                className={styles.input}
                name="type"
                value={formData.type}
                onChange={handleChange}
                autoComplete="off"
              >
                <option value="gym">Gym</option>
                <option value="yoga">Yoga</option>
              </select>
            </div>
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCancelEdit}
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 