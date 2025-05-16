import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import HeroSection from '../../components/HeroSection/HeroSection';
import ServicesSection from '../../components/ServicesSection/ServicesSection';
import EquipmentSection from '../../components/EquipmentSection/EquipmentSection';
import PackagesSection from '../../components/PackagesSection/PackagesSection';
import TrainersSection from '../../components/TrainersSection/TrainersSection';
import BlogSection from '../../components/BlogSection/BlogSection';
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
