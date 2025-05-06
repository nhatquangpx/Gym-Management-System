import styles from './LoginPage.module.css';
import LoginForm from '../LoginForm/LoginForm';

const LoginPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.loginContainer}>
        <div className={styles.loginHeader}>
          <h2>GymPro</h2>
          <p>Chào mừng bạn quay trở lại</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;