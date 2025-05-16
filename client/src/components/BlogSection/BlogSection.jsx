import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Link } from 'react-router-dom';
import styles from './BlogSection.module.css';

const blogPosts = [
  {
    id: 1,
    title: "5 Bài Tập Cardio Đốt Mỡ Hiệu Quả Tại Nhà",
    category: "Tập Luyện",
    image: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2",
    date: "15 Tháng 7, 2024",
    excerpt: "Khám phá các bài tập cardio đơn giản nhưng cực kỳ hiệu quả giúp bạn đốt cháy mỡ thừa..."
  },
  {
    id: 2,
    title: "Chế Độ Ăn Eat Clean Cho Người Mới Bắt Đầu",
    category: "Dinh Dưỡng",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
    date: "10 Tháng 7, 2024",
    excerpt: "Tìm hiểu về nguyên tắc cơ bản của chế độ ăn eat clean và cách xây dựng thực đơn hàng ngày..."
  },
  {
    id: 3,
    title: "Cách Tăng Cơ Bắp Nhanh Chóng Và An Toàn",
    category: "Tập Luyện",
    image: "https://images.unsplash.com/photo-1581009137052-c0b24a693789",
    date: "05 Tháng 7, 2024",
    excerpt: "Những bí quyết và lưu ý quan trọng giúp bạn xây dựng cơ bắp một cách hiệu quả và bền vững..."
  },
  {
    id: 4,
    title: "10 Động Tác Yoga Cơ Bản Cho Người Mới",
    category: "Yoga",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
    date: "01 Tháng 7, 2024",
    excerpt: "Hướng dẫn chi tiết các động tác yoga cơ bản giúp người mới bắt đầu dễ dàng tiếp cận..."
  },
  {
    id: 5,
    title: "Hướng Dẫn Sử Dụng Thiết Bị Gym An Toàn",
    category: "Hướng Dẫn",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    date: "28 Tháng 6, 2024",
    excerpt: "Các nguyên tắc và kỹ thuật cơ bản khi sử dụng các thiết bị tập luyện tại phòng gym..."
  }
];

const BlogSection = () => {
  return (
    <section id="blog-section" className={styles.blogSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Blog & Kiến Thức</h2>
        <p className={styles.sectionSubtitle}>
          Cập nhật những bài viết mới nhất về hướng dẫn tập luyện, chế độ dinh dưỡng và mẹo giữ dáng hiệu quả.
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
          className={styles.blogSwiper}
        >
          {blogPosts.map((post) => (
            <SwiperSlide key={post.id}>
              <Link to={`/blog/${post.id}`} className={styles.blogCard}>
              <div className={styles.blogImageContainer}>
                <img src={post.image} alt={post.title} className={styles.blogImage}/>
                <span className={styles.blogCategory}>{post.category}</span>
              </div>
              <div className={styles.blogContent}>
                <p className={styles.blogDate}>{post.date}</p>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogExcerpt}>{post.excerpt}</p>
                  <span className={styles.readMore}>
                    Đọc thêm
                    <i className="material-icons">arrow_forward</i>
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <Link to="/blog" className={styles.viewAllButton}>
          Xem Tất Cả Bài Viết
          <i className="material-icons">arrow_forward</i>
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
