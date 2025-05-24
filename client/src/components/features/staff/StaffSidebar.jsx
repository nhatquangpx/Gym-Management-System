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
import logo from "../../../assets/logo.svg";
import styles from './StaffSidebar.module.css';

const menu = [
  { name: "Dashboard", path: "/staff/dashboard", icon: <DashboardIcon /> },
  { name: "Hội viên", path: "/staff/members", icon: <GroupIcon /> },
  { name: "Gói tập", path: "/staff/packages", icon: <FitnessCenterIcon /> },
  { name: "Thiết bị", path: "/staff/equipment", icon: <BuildIcon /> },
  { name: "Đơn hàng", path: "/staff/orders", icon: <MonetizationOnIcon /> },
  { name: "Lịch sử tập luyện", path: "/staff/workouts", icon: <HistoryIcon /> },
  { name: "Lịch tập", path: "/staff/schedules", icon: <CalendarMonthIcon /> },
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
        {menu.map((item) => (
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