import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './EditProfilePage.module.css';
import Navbar from '../../components/Navbar/Navbar'; // Sử dụng Navbar chung
import Footer from '../../components/Footer/Footer'; // Sử dụng Footer chung
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';
import { useAuth } from '../../contexts/AuthContext'; // Sử dụng AuthContext

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, login, isLoggedIn } = useAuth(); // Lấy thông tin user và hàm login (để cập nhật user)

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: '',
    birthDate: '',
    address: '',
    occupation: '',
    avatar: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (user) {
      setFormData({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        birthDate: user.birthDate ? new Date(user.birthDate).toISOString().split('T')[0] : '',
        address: user.address || '',
        occupation: user.occupation || '',
        avatar: user.avatar || '',
      });
    }
  }, [user, isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: undefined });
    }
    if (successMessage) setSuccessMessage('');
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
      isValid = false;
    }
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone)) { // Allow 10 or 11 digits
      newErrors.phone = 'Số điện thoại không hợp lệ';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      setSuccessMessage('');
      console.log('Đang cập nhật thông tin:', formData);
      setTimeout(() => {
        const updatedUser = { 
          ...user, 
          name: formData.fullName,
          phone: formData.phone,
          gender: formData.gender,
          birthDate: formData.birthDate,
          address: formData.address,
          occupation: formData.occupation,
          avatar: formData.avatar,
        };
        login(updatedUser);
        setIsLoading(false);
        setSuccessMessage('Cập nhật thông tin thành công!');
      }, 1500);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.profileContainer}>
          <div className={styles.header}>
            <h1>Chỉnh Sửa Thông Tin Cá Nhân</h1>
            <p>Cập nhật thông tin của bạn để chúng tôi phục vụ tốt hơn.</p>
          </div>

          <form className={styles.profileForm} onSubmit={handleSubmit}>
            <div className={styles.avatarSection}>
              <img 
                src={formData.avatar || 'https://i.pravatar.cc/150?img=68'} // Changed default avatar for variety
                alt="Avatar" 
                className={styles.avatarPreview}
              />
              <label htmlFor="avatarUpload" className={styles.avatarUploadButton}>
                Thay đổi ảnh
              </label>
              <input 
                type="file" 
                id="avatarUpload" 
                accept="image/*" 
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>

            <div className={styles.formGrid}>
              <InputField
                id="fullName" label="Họ và tên" type="text"
                value={formData.fullName} onChange={handleChange}
                error={errors.fullName} required
              />
              <InputField
                id="email" 
                label="Email (Thông tin này không thể chỉnh sửa)" 
                type="email"
                value={formData.email} 
                disabled 
              />
              <InputField
                id="phone" label="Số điện thoại" type="tel"
                value={formData.phone} onChange={handleChange}
                error={errors.phone}
              />
              
              <div className={styles.formGroup}>
                <label htmlFor="gender" className={styles.label}>Giới tính</label>
                <select 
                  id="gender"
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className={styles.selectInput}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <InputField
                id="birthDate" label="Ngày sinh" type="date"
                value={formData.birthDate} onChange={handleChange}
              />
              <InputField
                id="address" label="Địa chỉ" type="text"
                placeholder="Ví dụ: 123 Đường ABC, Quận XYZ, TP. Hà Nội"
                value={formData.address} onChange={handleChange}
              />
              <InputField
                id="occupation" label="Công việc" type="text"
                placeholder="Ví dụ: Sinh viên, Nhân viên văn phòng"
                value={formData.occupation} onChange={handleChange}
              />
            </div>
            
            {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
            
            <div className={styles.buttonGroup}>
              <Button 
                type="button" 
                className={styles.backButton}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
              <Button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? 'Đang lưu...' : 'Lưu Thay Đổi'}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditProfilePage;
