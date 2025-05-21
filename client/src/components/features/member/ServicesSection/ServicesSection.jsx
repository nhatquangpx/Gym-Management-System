import styles from './ServicesSection.module.css';

const services = [
  {
    icon: "fitness_center", // Material Icon name
    title: "Tập Luyện Cá Nhân (PT)",
    description: "Chương trình tập luyện được thiết kế riêng bởi các HLV chuyên nghiệp, giúp bạn đạt mục tiêu nhanh chóng."
  },
  {
    icon: "groups",
    title: "Lớp Học Nhóm",
    description: "Tham gia các lớp học đa dạng như Yoga, Zumba, Boxing, Cycling với không khí sôi động và đầy năng lượng."
  },
  {
    icon: "spa",
    title: "Dịch Vụ Thư Giãn",
    description: "Tận hưởng các tiện ích như xông hơi, bể sục jacuzzi giúp phục hồi cơ bắp và thư giãn tinh thần sau buổi tập."
  },
  {
    icon: "restaurant",
    title: "Tư Vấn Dinh Dưỡng",
    description: "Nhận kế hoạch dinh dưỡng khoa học từ chuyên gia để tối ưu hóa kết quả tập luyện và cải thiện sức khỏe."
  }
];

const ServicesSection = () => {
  return (
    <section id="services-section" className={styles.servicesSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Dịch Vụ Của Chúng Tôi</h2>
        <p className={styles.sectionSubtitle}>
          GYMPRO cung cấp đa dạng các dịch vụ chất lượng cao để đáp ứng mọi nhu cầu tập luyện và chăm sóc sức khỏe của bạn.
        </p>
        <div className={styles.servicesGrid}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>
                <i className="material-icons">{service.icon}</i>
              </div>
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

