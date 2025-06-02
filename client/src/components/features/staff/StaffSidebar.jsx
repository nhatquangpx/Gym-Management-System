import { NavLink } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BuildIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FeedbackIcon from '@mui/icons-material/Feedback';
import BarChartIcon from '@mui/icons-material/BarChart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import logo from "../../../assets/logo.svg";
import styles from './StaffSidebar.module.css';

const menu = [
  { name: "Dashboard", path: "/staff/dashboard", icon: <DashboardIcon /> },
  { name: "Hội viên", path: "/staff/members", icon: <GroupIcon /> },
  { name: "Gói tập", path: "/staff/packages", icon: <FitnessCenterIcon /> },
  { name: "Phòng tập", path: "/staff/gymrooms", icon: <MeetingRoomIcon /> },
  { name: "Thiết bị", path: "/staff/equipment", icon: <BuildIcon /> },
  { name: "Quản lý đăng ký gói tập", path: "/staff/orders", icon: <MonetizationOnIcon /> },
  { name: "Theo dõi sử dụng dịch vụ", path: "/staff/service-history", icon: <HistoryIcon /> },
  { name: "Phản hồi", path: "/staff/feedback", icon: <FeedbackIcon /> },
  { name: "Tài khoản cá nhân", path: "/staff/account", icon: <AccountCircleIcon /> },
];

export default function StaffSidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoBox}>
        <img src={logo} alt="GYMPRO Logo" className={styles.logo} />
        <span className={styles.brand}>GYMPRO</span>
      </div>
      <nav className={styles.nav}>
        {menu.slice(0, 9).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
            end
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.name}</span>
          </NavLink>
        ))}
        <NavLink
          to="/staff/attendance"
          className={({ isActive }) =>
            isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
          }
          end
        >
          <span className={styles.icon}><HowToRegIcon /></span>
          <span className={styles.label}>Ghi nhận buổi tập</span>
        </NavLink>
        {menu.slice(9).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
            end
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
} 