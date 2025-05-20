import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './ForgotPasswordPage.module.css';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (error) setError(''); // Xóa lỗi khi người dùng nhập
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Vui lòng nhập email của bạn.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Địa chỉ email không hợp lệ.');
      return;
    }

    setIsLoading(true);
    // Giả lập gọi API
    console.log('Gửi yêu cầu reset mật khẩu cho email:', email);
    setTimeout(() => {
      setIsLoading(false);
      // Chuyển hướng đến trang thông báo, truyền email qua state
      navigate('/reset-password-sent', { state: { emailSentTo: email } }); 
    }, 1500);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2>Quên Mật Khẩu?</h2>
          <p>Đừng lo lắng! Nhập email bạn đã đăng ký và chúng tôi sẽ gửi mật khẩu mới đến cho bạn.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <InputField
            id="email"
            label="Email đăng ký"
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={handleChange}
            error={error}
            required={true}
          />

          <Button 
            type="submit" 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Gửi Yêu Cầu'}
          </Button>
        </form>

        <div className={styles.backToLogin}>
          <Link to="/login">Quay lại trang Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
