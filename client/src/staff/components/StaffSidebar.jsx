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
import logo from '../../assets/logo.svg';

const menu = [
  { name: "Dashboard", path: "/staff/dashboard", icon: <DashboardIcon /> },
  { name: "Hội viên", path: "/staff/members", icon: <GroupIcon /> },
  { name: "Gói tập", path: "/staff/packages", icon: <FitnessCenterIcon /> },
  { name: "Thiết bị", path: "/staff/equipment", icon: <BuildIcon /> },
  { name: "Đơn hàng", path: "/staff/orders", icon: <MonetizationOnIcon /> },
  { name: "Lịch sử tập luyện", path: "/staff/workouts", icon: <HistoryIcon /> },
  { name: "Lịch tập", path: "/staff/schedules", icon: <CalendarMonthIcon /> },
  { name: "Phản hồi", path: "/staff/feedback", icon: <FeedbackIcon /> },
  { name: "Thống kê", path: "/staff/statistics", icon: <BarChartIcon /> },
  { name: "Tài khoản cá nhân", path: "/staff/account", icon: <AccountCircleIcon /> },
];

export default function StaffSidebar() {
  return (
    <aside className="w-64 bg-[var(--admin-sidebar)] shadow-lg h-screen sticky top-0 flex flex-col border-r border-[var(--admin-border)]">
      <div className="p-6 text-2xl font-extrabold text-[var(--admin-text)] border-b border-[var(--admin-border)] flex items-center justify-center bg-[var(--admin-header)]">
        <img src={logo} alt="GYMPRO Logo" style={{ height: 40, marginRight: 12 }} /> <span className="tracking-wider">GYMPRO STAFF</span>
      </div>
      <nav className="mt-6 flex-1 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-all duration-300 mb-2 font-medium gap-3 ` +
              (isActive
                ? "bg-[var(--admin-accent)] text-[var(--admin-primary)] shadow-lg font-bold border-l-4 border-[var(--admin-primary)]"
                : "text-[var(--admin-text)] hover:bg-[var(--admin-accent)] hover:text-[var(--admin-primary)] hover:pl-8")
            }
            end
          >
            <span className="text-2xl">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-[var(--admin-text)] text-sm text-center border-t border-[var(--admin-border)] opacity-70 mt-auto bg-[var(--admin-sidebar)]">GymPro © 2024</div>
    </aside>
  );
} 