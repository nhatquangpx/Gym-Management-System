import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './RegisterPTPage.module.css';
import Button from '../../components/Button/Button';

// Dữ liệu mẫu với ảnh người thật
const trainers = [
  {
    id: 1,
    name: "Phạm Duy Đông",
    specialty: "Tăng cơ, Sức mạnh",
    experience: "5 năm kinh nghiệm",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" // Ảnh nam PT
  },
  {
    id: 2,
    name: "Đoàn Nhật Quang",
    specialty: "Yoga, Linh hoạt",
    experience: "7 năm kinh nghiệm",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" // Ảnh nữ Yoga
  },
  {
    id: 3,
    name: "Lê Quốc Đảng",
    specialty: "Crossfit, Cardio",
    experience: "4 năm kinh nghiệm",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" // Ảnh nam Crossfit
  },
  {
    id: 4,
    name: "Hồ Tuấn Huy",
    specialty: "Giảm cân, Dinh dưỡng",
    experience: "6 năm kinh nghiệm",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1594882645126-14020914d58d?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" // Ảnh nữ PT
  }
  // Thêm HLV nếu cần
];

const RegisterPT = () => {
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    if (location.state && location.state.package) {
      setPackageData(location.state.package);
    } else {
      navigate('/register/package');
    }
  }, [location, navigate]);

  const handleTrainerSelect = (trainer) => {
    setSelectedTrainer(trainer);
  };

  const handleContinue = () => {
    if (!selectedTrainer) return;
    navigate('/register/account', { 
      state: { package: packageData, trainer: selectedTrainer } 
    });
  };

  const handleBack = () => {
    navigate('/register/package');
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
      </div>

      <div className={styles.trainersGrid}>
        {trainers.map((trainer) => (
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
              <p className={styles.trainerExperience}>{trainer.experience}</p>
            </div>
               {/* Thêm nút chọn trực tiếp trên card */}
               <button className={`${styles.selectButton} ${selectedTrainer?.id === trainer.id ? styles.selectedButton : ''}`}>
                  {selectedTrainer?.id === trainer.id ? 'Đã chọn' : 'Chọn HLV'}
               </button>
      </div>
          ))}
      </div>

        <div className={styles.buttonGroup}>
          <Button 
            className={styles.backButton}
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button 
            className={`${styles.continueButton} ${!selectedTrainer ? styles.disabled : ''}`}
            onClick={handleContinue}
            disabled={!selectedTrainer}
          >
            Tiếp tục
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPT;
