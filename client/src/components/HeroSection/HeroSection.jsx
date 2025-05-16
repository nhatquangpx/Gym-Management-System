import { useRef } from 'react'; // Import useRef để scroll
import styles from './HeroSection.module.css';
import Button from '../Button/Button';
const HeroSection = () => {
  // Hàm scroll đến phần packages
  const handleExploreClick = () => {
    // Tìm element có id là 'packages-section'
    const packagesSection = document.getElementById('packages-section');
    if (packagesSection) {
      packagesSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroOverlay}></div>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          ĐÁNH THỨC <span className={styles.highlight}>SỨC MẠNH</span> TIỀM ẨN
        </h1>
        <p className={styles.heroSubtitle}>
          Tham gia GYMPRO ngay hôm nay để bắt đầu hành trình chinh phục mục tiêu sức khỏe và vóc dáng của bạn.
        </p>
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Tìm kiếm dịch vụ, gói tập, HLV..." 
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <i className="material-icons">search</i>
          </button>
        </div>
        <button 
          className={styles.ctaButton}
          onClick={handleExploreClick}
        >
          Khám Phá Các Gói Tập
          <i className="material-icons">arrow_downward</i>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
