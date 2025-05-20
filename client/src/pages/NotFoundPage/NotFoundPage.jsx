import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';
// Bạn có thể tìm một ảnh SVG hoặc PNG chibi cute và đặt vào thư mục assets
// import cuteCharacter from '../../assets/cute-character.svg'; 

const NotFoundPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        {/* <img src={cuteCharacter} alt="Cute Character" className={styles.characterImage} /> */}
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Ối! Trang không tồn tại</h1>
        <p className={styles.message}>
          Có vẻ như bạn đã đi lạc vào một vùng đất chưa được khám phá.
          Đừng lo, chúng tôi sẽ giúp bạn quay lại!
        </p>
        <Link to="/" className={styles.homeButton}>
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
