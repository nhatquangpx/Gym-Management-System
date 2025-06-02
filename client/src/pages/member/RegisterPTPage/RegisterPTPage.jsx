import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './RegisterPTPage.module.css';
import Button from '../../../components/common/Button/Button';

const RegisterPT = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [packageData, setPackageData] = useState(null);
  const { user, isLoggedIn } = useSelector(state => state.auth);
  
  // Kiểm tra trạng thái đăng nhập
  const isUserLoggedIn = isLoggedIn || !!localStorage.getItem('token');
  // Kiểm tra có bỏ qua bước nhập thông tin không
  const skipAccountInfo = location.state?.skipAccountInfo || false;

  useEffect(() => {
    if (location.state && location.state.package) {
      setPackageData(location.state.package);
      // Lấy loại gói tập (typePackage)
      const packageType = location.state.package.typePackage || 'gym';
      // Gọi API lấy danh sách huấn luyện viên dựa trên loại gói
      fetchTrainersByType(packageType);
    } else {
      navigate('/register/package');
    }
  }, [location, navigate]);
  
  const fetchTrainersByType = async (type) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8001/api/trainers/by-type/${type}`);
      
      if (!response.ok) {
        throw new Error(`Lỗi kết nối: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setTrainers(data.data);
      } else {
        throw new Error('Không thể tải danh sách huấn luyện viên');
      }
      
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải danh sách huấn luyện viên:', err);
      setError('Không thể tải danh sách huấn luyện viên. Vui lòng thử lại sau.');
      // Sử dụng dữ liệu mẫu khi gặp lỗi
      setTrainers([
        {
          id: 1,
          name: "Phạm Duy Đông",
          specialty: "Tăng cơ, Sức mạnh",
          experience: "5 năm kinh nghiệm",
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        },
        {
          id: 2,
          name: "Đoàn Nhật Quang",
          specialty: "Yoga, Linh hoạt",
          experience: "7 năm kinh nghiệm",
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTrainerSelect = (trainer) => {
    setSelectedTrainer(trainer);
  };  const handleContinue = () => {
    if (!selectedTrainer) return;
    
    console.log('Continue clicked on PT page');
    console.log('Selected trainer:', selectedTrainer);
    console.log('Package data:', packageData);
    console.log('Is user logged in:', isUserLoggedIn);
    console.log('Skip account info:', skipAccountInfo);
    
    if (isUserLoggedIn && skipAccountInfo) {
      // Người dùng đã đăng nhập - chuyển thẳng đến thanh toán
      console.log('Navigating to payment');
      navigate('/payment', { 
        state: { 
          package: packageData, 
          trainer: selectedTrainer,
          user: user
        } 
      });
    } else {
      // Người dùng chưa đăng nhập - flow cũ
      console.log('Navigating to account registration');
      navigate('/register/account', { 
        state: { package: packageData, trainer: selectedTrainer } 
      });
    }
  };
  const handleBack = () => {
    if (isUserLoggedIn) {
      navigate('/register/package');
    } else {
      navigate('/register/package');
    }
  };

  // Sử dụng container riêng
  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.header}>
          <h2>Chọn Huấn Luyện Viên</h2>
          <p>Lựa chọn huấn luyện viên phù hợp với mục tiêu tập luyện của bạn</p>
          {packageData && (
            <div className={styles.packageInfo}>
            <span>Gói đã chọn: </span>
            <strong>{packageData.name}</strong>
          </div>
        )}
      </div>      <div className={styles.trainersGrid}>
        {loading ? (
          <div className={styles.loading}>Đang tải danh sách huấn luyện viên...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : trainers.length === 0 ? (
          <div className={styles.noTrainers}>Không có huấn luyện viên phù hợp với gói tập đã chọn</div>
        ) : (
          trainers.map((trainer) => (
            <div 
              key={trainer.id}
              className={`${styles.trainerCard} ${selectedTrainer?.id === trainer.id ? styles.selected : ''}`}
              onClick={() => handleTrainerSelect(trainer)}
            >
              <div className={styles.trainerImage} style={{backgroundImage: `url(${trainer.image})`}} />
              <div className={styles.trainerContent}>
                <h3>{trainer.name}</h3>
                <div className={styles.trainerRating}>
                  <i className="material-icons">star</i>
                  <span>{trainer.rating}</span>
                </div>
                <p className={styles.trainerSpecialty}>{trainer.specialty}</p>
                <p className={styles.trainerExperience}>{trainer.experience || '5 năm kinh nghiệm'}</p>
              </div>
              {/* Thêm nút chọn trực tiếp trên card */}
              <button className={`${styles.selectButton} ${selectedTrainer?.id === trainer.id ? styles.selectedButton : ''}`}>
                {selectedTrainer?.id === trainer.id ? 'Đã chọn' : 'Chọn HLV'}
              </button>
            </div>
          ))
        )}
      </div>

        <div className={styles.buttonGroup}>
          <Button 
            className={styles.backButton}
            onClick={handleBack}
          >
            Quay lại
          </Button>          <Button 
            className={`${styles.continueButton} ${!selectedTrainer ? styles.disabled : ''}`}
            onClick={handleContinue}
            disabled={!selectedTrainer}
          >
            {isUserLoggedIn && skipAccountInfo ? 'Thanh toán' : 'Tiếp tục'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPT;
