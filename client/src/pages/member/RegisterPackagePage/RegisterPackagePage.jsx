import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './RegisterPackagePage.module.css';
import Button from '../../../components/common/Button/Button';

const RegisterPackage = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const navigate = useNavigate();
  
  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };
  
  // Tải danh sách gói tập từ API
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8001/api/packages');
        
        if (!response.ok) {
          throw new Error(`Lỗi kết nối: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Định dạng lại dữ liệu để hiển thị
        const formattedData = data.map(pkg => ({
          ...pkg,
          formattedPrice: formatPrice(pkg.price)
        }));
        
        setPackages(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Lỗi khi tải gói tập:', err);
        setError('Không thể tải danh sách gói tập. Vui lòng thử lại sau.');
        setLoading(false);
        
        // Nếu không thể tải từ API, sử dụng dữ liệu dự phòng
        setPackages([
          {
            id: "1",
            _id: "1",
            name: "Gói Basic",
            price: 500000,
            formattedPrice: "500.000đ",
            period: "/tháng",
            type: "Tự tập",
            features: [
              "Sử dụng tất cả các thiết bị",
              "Tập không giới hạn thời gian",
              "Tủ khóa cá nhân",
              "Phòng tắm",
              "Nước uống miễn phí",
              "Khăn tập"
            ]
          },
          {
            id: "2",
            _id: "2",
            name: "Gói Premium",
            price: 1200000,
            formattedPrice: "1.200.000đ",
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
            id: "3",
            _id: "3",
            name: "Gói VIP",
            price: 2000000,
            formattedPrice: "2.000.000đ",
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
        ]);
      }
    };
    
    fetchPackages();
  }, []);

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

  // Hàm xử lý nút quay lại
  const handleBackToLogin = () => {
    navigate('/login');
};
  return (
    <div className={styles.pageContainer}> 
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h1>Chọn Gói Tập</h1>
          <p>Lựa chọn gói tập phù hợp với mục tiêu của bạn</p>
        </div>

        {loading ? (
          <div className={styles.loading}>Đang tải gói tập...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <div className={styles.packagesGrid}>
            {packages.map((pkg) => (
            <div 
              key={pkg.id}
              className={`${styles.packageCard} ${selectedPackage?.id === pkg.id ? styles.selected : ''}`}
              onClick={() => handlePackageSelect(pkg)}
            >              <div className={styles.packageHeader}>
                <div className={styles.packageName}>{pkg.name}</div>
                <div className={styles.packageType}>{pkg.type}</div> 
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{pkg.formattedPrice || formatPrice(pkg.price)}</span>
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
            </div>          ))}
        </div>
        )}

        {/* Thêm nhóm nút */}
        <div className={styles.buttonGroup}>
          <Button 
            className={styles.backButton} // Style riêng cho nút quay lại
            onClick={handleBackToLogin} 
          >
            Quay lại
          </Button>
          <Button 
            className={`${styles.continueButton} ${!selectedPackage ? styles.disabled : ''}`}
            onClick={handleContinue}
            disabled={!selectedPackage}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPackage;
