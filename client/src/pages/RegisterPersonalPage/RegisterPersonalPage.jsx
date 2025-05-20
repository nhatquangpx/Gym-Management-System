import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterPersonalPage.module.css';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

const RegisterPersonal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [registrationData, setRegistrationData] = useState({});
  
  const [formData, setFormData] = useState({
    fullName: '',
    birthDate: '',
    address: '',
    occupation: '',
    gender: '' // Thêm state cho giới tính
  });

  useEffect(() => {
    if (location.state && location.state.account) {
      setRegistrationData(location.state);
    } else {
      navigate('/register/account'); // Chuyển về trang trước nếu thiếu dữ liệu
    }
  }, [location, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/register/confirm', {
      state: { ...registrationData, personal: formData }
    });
  };

  const handleBack = () => {
    navigate('/register/account', { state: registrationData });
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
        <h2>Thông Tin Cá Nhân</h2>
          <p>Nhập thông tin cá nhân của bạn (không bắt buộc)</p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <InputField
            id="fullName" label="Họ và tên" type="text"
            placeholder="Nhập họ và tên của bạn" value={formData.fullName}
          onChange={handleChange}
        />

          {/* Thêm phần chọn giới tính */}
          <div className={styles.formGroup}>
            <label className={styles.label}>Giới tính</label>
            <div className={styles.genderOptions}>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Nam" 
                  checked={formData.gender === 'Nam'} 
                  onChange={handleChange} 
                  className={styles.radioInput}
        />
                Nam
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Nữ" 
                  checked={formData.gender === 'Nữ'} 
                  onChange={handleChange} 
                  className={styles.radioInput}
        />
                Nữ
              </label>
              <label className={styles.radioLabel}>
                <input 
                  type="radio" 
                  name="gender" 
                  value="Khác" 
                  checked={formData.gender === 'Khác'} 
                  onChange={handleChange} 
                  className={styles.radioInput}
        />
                Khác
              </label>
        </div>
      </div>

          <InputField
            id="birthDate" label="Ngày sinh" type="date"
            value={formData.birthDate} onChange={handleChange}
          />

          <InputField
            id="address" label="Địa chỉ" type="text"
            placeholder="Nhập địa chỉ của bạn" value={formData.address}
            onChange={handleChange}
          />

          <InputField
            id="occupation" label="Công việc" type="text"
            placeholder="Nhập công việc của bạn" value={formData.occupation}
            onChange={handleChange}
          />

          {/* Bỏ phần note vì đã ghi chú ở tiêu đề */}
          {/* <div className={styles.note}>...</div> */}
          <div className={styles.buttonGroup}>
            <Button 
              type="button" className={styles.backButton}
              onClick={handleBack}
            >
              Quay lại
            </Button>
            <Button 
              type="submit" className={styles.continueButton}
            >
              Tiếp tục
            </Button>
    </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPersonal;
