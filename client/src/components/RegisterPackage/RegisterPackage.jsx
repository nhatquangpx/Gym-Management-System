import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPackage.module.css';
import Button from '../Button/Button';

const packages = [
  {
    id: 1,
    name: "Gói Basic",
    price: "500,000đ",
    period: "/tháng",
    type: "Tự tập",
    features: [
      "Sử dụng tất cả các thiết bị",
      "Tập không giới hạn thời gian",
      "Tủ khóa cá nhân",
      "Phòng tắm",
      "Nước uống miễn phí",
      "Khăn tập",
    ]
  },
  {
    id: 2,
    name: "Gói Premium",
    price: "1,200,000đ",
    period: "/tháng",
    type: "Tập với PT",
    features: [
      "Tất cả quyền lợi của gói Basic",
      "12 buổi tập với PT/tháng",
      "Lịch tập cá nhân hóa",
      "Tư vấn dinh dưỡng",
      "Đánh giá thể chất định kỳ",
      "Ưu tiên đặt lịch"
    ]
  },
  {
    id: 3,
    name: "Gói VIP",
    price: "2,000,000đ",
    period: "/tháng",
    type: "Tập với PT",
    features: [
      "Tất cả quyền lợi của gói Premium",
      "24 buổi tập với PT/tháng", 
      "Chế độ dinh dưỡng theo tuần",
      "Đo chỉ số cơ thể định kỳ",
      "Tư vấn 24/7",
      "Đồ uống protein sau tập"
    ]
  }
];

const RegisterPackage = () => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };

  const handleContinue = () => {
    if (!selectedPackage) return;
    
    if (selectedPackage.type === "Tập với PT") {
      navigate('/register/pt', { state: { package: selectedPackage } });
    } else {
      navigate('/register/account', { state: { package: selectedPackage } });
    }
  };

  return (
    <div className={styles.pageContainer}> 
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
        <h1>Chọn Gói Tập</h1>
        <p>Lựa chọn gói tập phù hợp với mục tiêu của bạn</p>
      </div>

      <div className={styles.packagesGrid}>
        {packages.map((pkg) => (
            <div 
            key={pkg.id}
            className={`${styles.packageCard} ${selectedPackage?.id === pkg.id ? styles.selected : ''}`}
            onClick={() => handlePackageSelect(pkg)}
          >
              <div className={styles.packageHeader}>
                <div className={styles.packageName}>{pkg.name}</div>
                {/* Di chuyển badge lên trên */}
                <div className={styles.packageType}>{pkg.type}</div> 
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{pkg.price}</span>
                  <span className={styles.period}>{pkg.period}</span>
          </div>
      </div>
            
            <div className={styles.packageFeatures}>
              {pkg.features.map((feature, index) => (
                <div key={index} className={styles.feature}>
                  <i className="material-icons">check_circle</i>
                  <span>{feature}</span>
      </div>
              ))}
            </div>

            <div className={styles.packageFooter}>
                <button 
                className={`${styles.selectButton} ${selectedPackage?.id === pkg.id ? styles.selectedButton : ''}`}
      >
                {selectedPackage?.id === pkg.id ? 'Đã chọn' : 'Chọn gói'}
              </button>
            </div>
          </div>
        ))}
      </div>

        <Button 
        className={`${styles.continueButton} ${!selectedPackage ? styles.disabled : ''}`}
        onClick={handleContinue}
        disabled={!selectedPackage}
      >
        Tiếp tục
      </Button>
      </div>
    </div>
  );
};

export default RegisterPackage;
