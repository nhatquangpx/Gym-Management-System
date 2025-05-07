import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from './ResetPasswordSentPage.module.css';
import Button from '../Button/Button';
import { useState } from 'react';

const ResetPasswordSentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const emailSentTo = location.state?.emailSentTo; // Lấy email từ state
  const [isResending, setIsResending] = useState(false);
  const [resentMessage, setResentMessage] = useState('');


  const handleResendEmail = () => {
    if (!emailSentTo) return; // Không có email để gửi lại
    setIsResending(true);
    setResentMessage('');
    // Giả lập gửi lại email
    console.log('Gửi lại email đến:', emailSentTo);
    setTimeout(() => {
      setIsResending(false);
      setResentMessage(`Đã gửi lại email đến ${emailSentTo}. Vui lòng kiểm tra hộp thư của bạn.`);
    }, 1500);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.iconContainer}>
          <i className="material-icons">mark_email_read</i>
        </div>
        <div className={styles.header}>
          <h2>Kiểm Tra Email Của Bạn</h2>
          {emailSentTo ? (
            <p>
              Chúng tôi đã gửi một email chứa mật khẩu mới đến <strong>{emailSentTo}</strong>. 
              Vui lòng kiểm tra hộp thư đến (và cả thư mục spam).
            </p>
          ) : (
            <p>
              Mật khẩu mới đã được gửi. Vui lòng kiểm tra hộp thư đến (và cả thư mục spam).
            </p>
          )}
        </div>

        {resentMessage && <p className={styles.resentMessage}>{resentMessage}</p>}

        <div className={styles.actions}>
          <Button 
            className={styles.actionButton}
            onClick={() => navigate('/login')}
          >
            Quay lại Đăng nhập
          </Button>
          {emailSentTo && ( // Chỉ hiển thị nút gửi lại nếu có email
            <Button 
              className={`${styles.actionButton} ${styles.resendButton}`}
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? 'Đang gửi lại...' : 'Chưa nhận được? Gửi lại'}
            </Button>
          )}
        </div>

        <div className={styles.helpText}>
          Nếu bạn không nhận được email trong vài phút, hãy thử kiểm tra thư mục spam hoặc <Link to="/forgot-password">thử lại với một địa chỉ email khác</Link>.
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordSentPage;
