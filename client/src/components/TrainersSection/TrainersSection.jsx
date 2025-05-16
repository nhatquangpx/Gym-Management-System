import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import styles from './TrainersSection.module.css';

const homeTrainers = [
  {
    id: 1,
    name: "Phạm Duy Đông",
    specialty: "Tăng cơ, Sức mạnh",
    experience: "5 năm kinh nghiệm",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
  },
  {
    id: 2,
    name: "Đoàn Nhật Quang",
    specialty: "Yoga, Linh hoạt",
    experience: "7 năm kinh nghiệm",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
  },
  {
    id: 3,
    name: "Nguyễn Khánh Toàn",
    specialty: "Crossfit, Cardio",
    experience: "4 năm kinh nghiệm",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
  },
  {
    id: 4,
    name: "Hồ Tuấn Huy",
    specialty: "Giảm cân, Dinh dưỡng",
    experience: "6 năm kinh nghiệm",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1594882645126-14020914d58d"
  },
  // Thêm HLV
  {
    id: 5,
    name: "Lê QUốc Đảng",
    specialty: "Boxing, MMA",
    experience: "8 năm kinh nghiệm",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
  },
  {
    id: 6,
    name: "Nguyễn Bùi Tuấn Linh",
    specialty: "Pilates, Stretching",
    experience: "5 năm kinh nghiệm",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2"
  }
];

const TrainersSection = () => {
  return (
    <section id="trainers-section" className={styles.trainersSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Đội Ngũ Huấn Luyện Viên</h2>
        <p className={styles.sectionSubtitle}>
          Gặp gỡ những chuyên gia tận tâm, giàu kinh nghiệm, sẵn sàng đồng hành cùng bạn trên con đường chinh phục mục tiêu.
        </p>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className={styles.trainersSwiper}
        >
          {homeTrainers.map((trainer) => (
            <SwiperSlide key={trainer.id}>
              <Link to={`/trainers/${trainer.id}`} className={styles.trainerCard}>
              <div className={styles.trainerImageContainer}>
                <img src={trainer.image} alt={trainer.name} className={styles.trainerImage} />
                  <div className={styles.trainerOverlay}>
                    <span className={styles.viewProfile}>Xem thông tin</span>
              </div>
            </div>
                <div className={styles.trainerInfo}>
                  <h3 className={styles.trainerName}>{trainer.name}</h3>
                  <p className={styles.trainerSpecialty}>{trainer.specialty}</p>
                  <div className={styles.trainerStats}>
                    <span className={styles.experience}>{trainer.experience}</span>
                    <div className={styles.rating}>
                      <i className="material-icons">star</i>
                      <span>{trainer.rating}</span>
        </div>
      </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <Link to="/trainers" className={styles.viewAllButton}>
          Xem Tất Cả Huấn Luyện Viên
          <i className="material-icons">arrow_forward</i>
        </Link>
      </div>
    </section>
  );
};

export default TrainersSection;
