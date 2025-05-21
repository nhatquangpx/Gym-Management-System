import styles from './PackagesSection.module.css';
import { Link } from 'react-router-dom';
import Button from '../../../common/Button/Button';

const homePackages = [ // Dữ liệu gói tập cho trang chủ
  {
    id: 1,
    name: "Gói Linh Hoạt",
    price: "500,000đ",
    period: "/tháng",
    type: "Tự tập",
    description: "Phù hợp cho người mới bắt đầu hoặc muốn duy trì thói quen tập luyện.",
    highlight: true, // Gói nổi bật
  },
  {
    id: 2,
    name: "Gói Chuyên Sâu PT",
    price: "1,200,000đ",
    period: "/tháng",
    type: "Tập với PT",
    description: "Đạt mục tiêu nhanh hơn với sự hướng dẫn 1:1 từ huấn luyện viên chuyên nghiệp.",
  },
  {
    id: 3,
    name: "Gói Toàn Diện VIP",
    price: "2,000,000đ",
    period: "/tháng",
    type: "Tập với PT",
    description: "Trải nghiệm dịch vụ cao cấp nhất với nhiều đặc quyền và hỗ trợ toàn diện.",
  }
];

const PackagesSection = () => {
  return (
    <section id="packages-section" className={styles.packagesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Gói Tập Ưu Đãi</h2>
        <p className={styles.sectionSubtitle}>
          Khám phá các gói tập đa dạng được thiết kế để phù hợp với mọi nhu cầu và ngân sách của bạn.
        </p>
        <div className={styles.packagesGrid}>
          {homePackages.map((pkg) => (
            <div key={pkg.id} className={`${styles.packageCard} ${pkg.highlight ? styles.highlighted : ''}`}>
              {pkg.highlight && <div className={styles.highlightBadge}>Nổi bật</div>}
              <div className={styles.packageType}>{pkg.type}</div>
              <h3 className={styles.packageName}>{pkg.name}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{pkg.price}</span>
                <span className={styles.period}>{pkg.period}</span>
              </div>
              <p className={styles.packageDescription}>{pkg.description}</p>
              <Link to="/register/package" className={styles.detailsLink}>
                Xem chi tiết & Đăng ký
                <i className="material-icons">arrow_forward</i>
              </Link>
            </div>
          ))}
        </div>
        <div className={styles.promoSection}>
            <h4>Ưu Đãi Đặc Biệt!</h4>
            <p>Đăng ký ngay hôm nay để nhận giảm giá <strong>15%</strong> cho gói tập đầu tiên và một buổi tập thử miễn phí với PT!</p>
            <Link to="/register/package">
                <Button className={styles.promoButton}>Nhận Ưu Đãi Ngay</Button>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default PackagesSection;

