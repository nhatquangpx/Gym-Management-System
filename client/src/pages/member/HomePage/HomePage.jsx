import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import HeroSection from '../../../components/features/member/HeroSection/HeroSection';
import ServicesSection from '../../../components/features/member/ServicesSection/ServicesSection';
import EquipmentSection from '../../../components/features/member/EquipmentSection/EquipmentSection';
import PackagesSection from '../../../components/features/member/PackagesSection/PackagesSection';
import TrainersSection from '../../../components/features/member/TrainersSection/TrainersSection';
import BlogSection from '../../../components/features/member/BlogSection/BlogSection';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <Navbar />
      <main className={styles.mainContent}>
        <HeroSection />
        <ServicesSection />
        <EquipmentSection />
        <PackagesSection />
        <TrainersSection />
        <BlogSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
