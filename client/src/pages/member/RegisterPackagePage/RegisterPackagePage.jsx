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
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải gói tập:', err);
        setError('Không thể tải danh sách gói tập. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackages();
  }, []);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
  };
  const handleContinue = () => {
    if (!selectedPackage) return;
    
    if (selectedPackage.type === "Tự tập") {
      navigate('/register/account', { state: { package: selectedPackage } });
    } else {
      navigate('/register/pt', { state: { package: selectedPackage } });
    }
  };

  // Hàm xử lý nút quay lại
  const handleBack = () => {
    navigate(-1); // Quay lại trang trước đó
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
            onClick={handleBack} 
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
