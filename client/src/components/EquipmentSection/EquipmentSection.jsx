import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import styles from './EquipmentSection.module.css';

const equipmentData = {
  title: "Trang Thiết Bị Hiện Đại",
  subtitle: "Chúng tôi đầu tư vào những dòng máy tập tiên tiến nhất từ các thương hiệu hàng đầu thế giới, đảm bảo trải nghiệm tập luyện an toàn và hiệu quả.",
  categories: [
    { 
      name: "Cardio Zone", 
      items: ["Máy chạy bộ Life Fitness", "Xe đạp tập Technogym", "Máy elliptical Precor"],
      image: "https://images.unsplash.com/photo-1641126477398-a05cc822c7a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    { 
      name: "Strength Area", 
      items: ["Dàn tạ khối Hammer Strength", "Máy tập đa năng Hoist", "Khu vực tạ tay Dumbbells"],
      image: "https://images.unsplash.com/photo-1638805981949-362f5964521e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    { 
      name: "Functional Training", 
      items: ["Kettlebells, Dây TRX", "Bóng tập Bosu, Plyo Boxes", "Khu vực tập tự do rộng rãi"],
      image: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    { 
      name: "Yoga & Stretching", 
      items: ["Thảm yoga cao cấp", "Dụng cụ hỗ trợ stretching", "Phòng tập riêng tư"],
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    { 
      name: "Recovery Zone", 
      items: ["Máy massage cơ bắp", "Phòng xông hơi", "Khu vực thư giãn"],
      image: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    { 
      name: "Free Weight Area", 
      items: ["Khu vực tạ tự do", "Khung squat rack", "Băng ghế tập đa năng"],
      image: "https://images.unsplash.com/photo-1637666062717-1c6bcfa4a4df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    { 
      name: "Combat Zone", 
      items: ["Bao đấm chuyên nghiệp", "Khu vực MMA", "Găng tay & Phụ kiện"],
      image: "https://images.unsplash.com/photo-1615117972428-28de77cf1258?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    },
    { 
      name: "Group Exercise", 
      items: ["Phòng tập rộng rãi", "Hệ thống âm thanh hiện đại", "Dụng cụ tập nhóm"],
      image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80"
    }
  ]
};

const EquipmentSection = () => {
  return (
    <section className={styles.equipmentSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>{equipmentData.title}</h2>
        <p className={styles.sectionSubtitle}>{equipmentData.subtitle}</p>
        
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
          className={styles.equipmentSwiper}
        >
          {equipmentData.categories.map((category, index) => (
            <SwiperSlide key={index}>
              <div className={styles.categoryCard}>
                <div 
                  className={styles.categoryImage} 
                  style={{backgroundImage: `url(${category.image})`}}
                >
                  <div className={styles.categoryOverlay}>
                    <h3 className={styles.categoryName}>{category.name}</h3>
                  </div>
                </div>
                <ul className={styles.itemList}>
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <i className="material-icons">check</i>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default EquipmentSection;
