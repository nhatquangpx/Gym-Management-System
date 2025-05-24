import { NavLink } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BuildIcon from '@mui/icons-material/Build';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HistoryIcon from '@mui/icons-material/History';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import logo from "../../../assets/logo.svg";
import styles from './Sidebar.module.css';

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { name: "Thành viên", path: "/admin/members", icon: <GroupIcon /> },
  { name: "Nhân viên/Huấn luyện viên", path: "/admin/employees", icon: <PeopleIcon /> },
  { name: "Gói tập", path: "/admin/packages", icon: <FitnessCenterIcon /> },
  { name: "Quản lý đăng ký gói tập", path: "/admin/orders", icon: <ReceiptLongIcon /> },
  { name: "Thiết bị", path: "/admin/equipment", icon: <BuildIcon /> },
  { name: "Lịch sử tập luyện", path: "/admin/workouts", icon: <HistoryIcon /> },
  { name: "Phản hồi", path: "/admin/feedback", icon: <FeedbackIcon /> },
  { name: "Tài khoản admin", path: "/admin/account", icon: <AccountCircleIcon /> },
];

export default function Sidebar() {
  // Danh sách các path cần đổi màu icon khi active
  const whiteIconPaths = [
    '/admin/equipment',
    '/admin/workouts',
    '/admin/feedback',
  ];
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