import styles from './AuthLayout.module.css';

// AuthLayout giờ chỉ cung cấp cấu trúc hộp giữa và overlay (nếu cần)
// Ảnh nền sẽ được định nghĩa trong CSS của component sử dụng nó hoặc component cha.
const AuthLayout = ({ children, className = '' }) => {
  return (
    // Không còn .authBg ở đây, component cha sẽ cung cấp background
    <div className={styles.layoutContainer}> 
      <div className={`${styles.centerBox} ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout; 
