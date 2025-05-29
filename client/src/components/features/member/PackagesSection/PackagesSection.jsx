import styles from './PackagesSection.module.css';
import { Link } from 'react-router-dom';
import Button from '../../../common/Button/Button';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React from 'react';

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

// Modal riêng cho PackagesSection
function PackageModal({ open, onClose, onConfirm, title, infoRows, confirmText, cancelText, icon }) {
  if (!open) return null;
  return (
    <div className={styles.packageModalOverlay} onClick={onClose}>
      <div className={styles.packageModalContent} onClick={e => e.stopPropagation()}>
        {icon && <div className={styles.packageModalIcon}><i className="material-icons">{icon}</i></div>}
        <div className={styles.packageModalTitle}>{title}</div>
        <div className={styles.packageModalMessage}>
          {infoRows.map((row, idx) => (
            <div className={styles.packageModalInfoRow} key={idx}>
              <span className={styles.packageModalInfoLabel}>{row.label}</span> 
              <span className={row.isPrice ? styles.packageModalPrice : styles.packageModalInfoValue}>{row.value}</span>
            </div>
          ))}
        </div>
        <div className={styles.packageModalButtons}>
          <button className={styles.packageModalConfirmBtn} onClick={onConfirm}>{confirmText}</button>
          <button className={styles.packageModalCancelBtn} onClick={onClose}>{cancelText}</button>
        </div>
      </div>
    </div>
  );
}

const PackagesSection = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);
  const [modalType, setModalType] = React.useState(''); // 'info' | 'register'
  const [selectedPackage, setSelectedPackage] = React.useState(null);

  // Giả lập kiểm tra user có gói tập đang sử dụng không
  const hasActivePackage = user && user.activePackage; // hoặc lấy từ redux/api thực tế

  const handlePackageClick = (pkg) => {
    setSelectedPackage(pkg);
    if (user) {
      if (hasActivePackage) {
        setModalType('info');
        setShowModal(true);
      } else {
        setModalType('register');
        setShowModal(true);
      }
    } else {
      // Chưa đăng nhập thì vẫn link sang đăng ký
      navigate('/register/package');
    }
  };

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
              <button className={styles.detailsLink} onClick={() => handlePackageClick(pkg)}>
                Xem chi tiết & Đăng ký
                <i className="material-icons">arrow_forward</i>
              </button>
            </div>
          ))}
        </div>
        {/* Promo section chỉ hiện khi chưa đăng nhập */}
        {!user && (
          <div className={styles.promoSection}>
            <h4>Ưu Đãi Đặc Biệt!</h4>
            <p>Đăng ký ngay hôm nay để nhận giảm giá <strong>15%</strong> cho gói tập đầu tiên và một buổi tập thử miễn phí với PT!</p>
            <Link to="/register/package">
              <Button className={styles.promoButton}>Nhận Ưu Đãi Ngay</Button>
            </Link>
          </div>
        )}
        {/* Modal xử lý đăng ký hoặc thông báo đã có gói tập */}
        {showModal && modalType === 'info' && (
          <PackageModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => { setShowModal(false); navigate('/my-packages'); }}
            title="Bạn đang sử dụng gói tập"
            icon="info"
            infoRows={[
              { label: '', value: 'Bạn đang sử dụng một gói tập. Vui lòng quản lý hoặc gia hạn tại trang Gói tập của tôi.', isPrice: false }
            ]}
            confirmText="Xem gói tập của tôi"
            cancelText="Đóng"
          />
        )}
        {showModal && modalType === 'register' && selectedPackage && user && (
          <PackageModal
            open={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={() => { setShowModal(false); /* Xử lý thanh toán sau */ }}
            title="Đăng ký gói tập"
            icon="how_to_reg"
            infoRows={[
              { label: 'Tên gói: ', value: selectedPackage.name },
              { label: 'Loại: ', value: selectedPackage.type },
              { label: 'Mô tả: ', value: selectedPackage.description },
              { label: 'Giá: ', value: `${selectedPackage.price}${selectedPackage.period}`, isPrice: true },
            ]}
            confirmText="Thanh toán"
            cancelText="Để sau"
          />
        )}
      </div>
    </section>
  );
};

export default PackagesSection;

