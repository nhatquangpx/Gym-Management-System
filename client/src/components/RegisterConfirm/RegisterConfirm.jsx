import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterConfirm.module.css';
import Button from '../Button/Button';

const RegisterConfirm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    if (location.state && location.state.package && location.state.account && location.state.personal) {
      setRegistrationData(location.state);
    } else {
      navigate('/register/package');
    }
  }, [location, navigate]);

  const handleBack = () => {
    navigate('/register/personal', { state: registrationData });
  };

  const handleConfirm = () => {
    console.log('Đăng ký thành công:', registrationData);
    if (registrationData.package.type === "Tập với PT" && registrationData.trainer) {
      navigate('/register/consult', { state: registrationData });
    } else {
      navigate('/payment', { state: registrationData });
    }
  };

  if (!registrationData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
        <h2>Xác Nhận Thông Tin</h2>
        <p>Vui lòng kiểm tra lại thông tin trước khi đăng ký</p>
      </div>

        <div className={styles.confirmationGrid}>
          <div className={styles.column}>
            <div className={styles.confirmationSection}>
              <h3>Thông tin gói tập</h3>
              <div className={styles.infoCard}>
          <div className={styles.infoRow}>
                  <span className={styles.label}>Gói tập:</span>
                  <span className={styles.value}>{registrationData.package.name}</span>
          </div>
          <div className={styles.infoRow}>
                  <span className={styles.label}>Giá:</span>
                  <span className={styles.value}>{registrationData.package.price}{registrationData.package.period}</span>
          </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Loại:</span>
                  <span className={styles.value}>{registrationData.package.type}</span>
              </div>
              </div>
              </div>

            <div className={styles.confirmationSection}>
        <h3>Thông tin tài khoản</h3>
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{registrationData.account.email}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Số điện thoại:</span>
            <span className={styles.value}>{registrationData.account.phone}</span>
          </div>
        </div>
          </div>
          </div>
          <div className={styles.column}>
            {registrationData.trainer && (
              <div className={styles.confirmationSection}>
                <h3>Thông tin huấn luyện viên</h3>
                <div className={styles.infoCard}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Tên HLV:</span>
                    <span className={styles.value}>{registrationData.trainer.name}</span>
          </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Chuyên môn:</span>
                    <span className={styles.value}>{registrationData.trainer.specialty}</span>
        </div>
      </div>
      </div>
            )}

            <div className={styles.confirmationSection}>
              <h3>Thông tin cá nhân</h3>
              <div className={styles.infoCard}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Họ và tên:</span>
                  <span className={styles.value}>{registrationData.personal.fullName || "Chưa cung cấp"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Giới tính:</span>
                  <span className={styles.value}>{registrationData.personal.gender || "Chưa cung cấp"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Ngày sinh:</span>
                  <span className={styles.value}>{registrationData.personal.birthDate || "Chưa cung cấp"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Địa chỉ:</span>
                  <span className={styles.value}>{registrationData.personal.address || "Chưa cung cấp"}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Công việc:</span>
                  <span className={styles.value}>{registrationData.personal.occupation || "Chưa cung cấp"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <Button 
            className={styles.backButton}
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button 
            className={styles.confirmButton}
            onClick={handleConfirm}
          >
            Xác nhận & Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterConfirm;