import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './TrainerSidebar.module.css';
import logo from '../../../assets/logo.svg';
import { FaChartBar, FaUsers, FaCalendarAlt, FaDumbbell, FaBookOpen, FaChartLine, FaCog } from 'react-icons/fa';

const TrainerSidebar = () => {
  const menuItems = [
    { path: '/trainer/dashboard', label: 'Tổng quan', icon: <FaChartBar /> },
    { path: '/trainer/students', label: 'Quản lý học viên', icon: <FaUsers /> },
    { path: '/trainer/schedule', label: 'Lịch tập', icon: <FaCalendarAlt /> },
    { path: '/trainer/workouts', label: 'Đánh giá học viên', icon: <FaDumbbell /> },
    { path: '/trainer/progress', label: 'Đánh giá tiến độ', icon: <FaChartLine /> },
    { path: '/trainer/settings', label: 'Cài đặt', icon: <FaCog /> },
  ];

  return (
    <aside className={`${styles.sidebar} ${styles.sidebarFixed}`}>
      <div className={styles.logoBox}>
        <img src={logo} alt="GymPro Logo" className={styles.logo} />
        <span className={styles.brand}>GYMPRO</span>
      </div>
      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default TrainerSidebar; 