import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterConsultPage.module.css';
import Button from '../../../components/common/Button/Button';

const RegisterConsult = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    if (location.state && location.state.trainer) {
      setRegistrationData(location.state);
    } else {
      navigate('/register/package');
    }
  }, [location, navigate]);
  const handleContinueToPayment = () => { 
    // Bắt buộc chuyển đến trang thanh toán thay vì đăng nhập
    navigate('/payment', { state: registrationData }); 
  };

  if (!registrationData) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2>Tư Vấn Với Huấn Luyện Viên</h2>
          <p>Thông tin liên hệ và các bước tiếp theo</p>
        </div>

        <div className={styles.consultLayout}>
          <div className={styles.trainerSection}>
            <h4>Huấn luyện viên</h4> 
            <div className={styles.trainerInfo}>
              <div className={styles.trainerImage} style={{backgroundImage: `url(${registrationData.trainer.image})`}} />
              <div className={styles.trainerDetails}>
                <h4>{registrationData.trainer.name}</h4>
                <p>{registrationData.trainer.specialty}</p>
                <div className={styles.trainerRating}>
                  <i className="material-icons">star</i>
                  <span>{registrationData.trainer.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactSection}>
             <h4>Thông tin liên hệ</h4> 
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <i className="material-icons">phone</i>
                <div>
                    <h5>Số điện thoại Gym</h5>
                  <p>0987 654 321</p>
                  <small>Liên hệ trong giờ hành chính</small>
                </div>
              </div>

              <div className={styles.contactItem}>
                <i className="material-icons">location_on</i>
                <div>
                    <h5>Địa chỉ Gym</h5>
                    <p>GymPro Center, 123 Đường ABC, Quận XYZ, TP. HCM</p>
                  <small>Mở cửa: 6:00 - 22:00 hàng ngày</small>
                </div>
              </div>
            </div>            <div className={styles.note}>
              <i className="material-icons">info</i>
              <p>
                Đăng ký của bạn đã được ghi nhận. Huấn luyện viên <strong>{registrationData.trainer.name}</strong> sẽ liên hệ với bạn trong vòng 24 giờ để tư vấn chi tiết. 
                Để kích hoạt tài khoản và gói tập của bạn, vui lòng tiếp tục để thanh toán ngay bây giờ. Tài khoản sẽ chỉ được kích hoạt sau khi thanh toán thành công.
              </p>
            </div>
          </div>
        </div>        <Button 
          className={styles.actionButton} 
          onClick={handleContinueToPayment} 
      >
          Tiếp tục thanh toán
      </Button>
      </div>
    </div>
  );
};

export default RegisterConsult;
