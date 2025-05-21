import styles from './Footer.module.css';
import { Link } from 'react-router-dom';
const Footer = () => {
  // Hàm scroll đến section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>GYMPRO</h4>
          <p>
            Nơi bạn tìm thấy sức mạnh và sự tự tin. 
            Tham gia cùng chúng tôi để bắt đầu hành trình thay đổi bản thân!
          </p>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Liên kết nhanh</h4>
          <ul className={styles.footerLinks}>
            <li>
              <button onClick={() => scrollToSection('packages-section')} className={styles.footerLink}>
                <i className="material-icons">fitness_center</i>
                Gói tập
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('trainers-section')} className={styles.footerLink}>
                <i className="material-icons">person</i>
                Huấn luyện viên
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('blog-section')} className={styles.footerLink}>
                <i className="material-icons">article</i>
                Blog
              </button>
            </li>
            <li>
              <Link to="/contact" className={styles.footerLink}>
                <i className="material-icons">contact_support</i>
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Thông tin liên hệ</h4>
          <div className={styles.contactInfo}>
            <p>
              <i className="material-icons">location_on</i>
              <span>123 Đường ABC, Quận XYZ, TP. Hà Nội</span>
            </p>
            <p>
              <i className="material-icons">phone</i>
              <span>(028) 1234 5678</span>
            </p>
            <p>
              <i className="material-icons">email</i>
              <span>info@gympro.com</span>
            </p>
            <p>
              <i className="material-icons">access_time</i>
              <span>Thời gian: 6:00 - 22:00 (Tất cả các ngày)</span>
            </p>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h4 className={styles.footerTitle}>Kết nối với chúng tôi</h4>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <i className="material-icons">facebook</i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <i className="material-icons">smart_display</i>
  
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <i className="material-icons">videocam</i>
            </a>
            <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
              <i className="material-icons">chat</i>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <p>&copy; {new Date().getFullYear()} GYMPRO. PROJECT ITSS THẦY TUẤN.</p>
      </div>
    </footer>
  );
};

export default Footer;

