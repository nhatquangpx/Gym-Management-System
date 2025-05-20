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
    <aside className="w-64 bg-[#1f1f1f] shadow-2xl h-screen sticky top-0 flex flex-col border-r-4 border-[#e53935]">
      <div className="p-6 text-2xl font-extrabold text-white border-b border-[#e53935] flex items-center justify-center bg-gradient-to-r from-[#e53935] to-[#b71c1c] shadow-lg">
        <img src={logo} alt="GYMPRO Logo" style={{ height: 40, marginRight: 12 }} /> <span className="drop-shadow-lg tracking-wider">GYMPRO STAFF</span>
      </div>
      <nav className="mt-6 flex-1 overflow-y-auto">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg transition-all duration-300 mb-2 font-medium gap-3 ` +
              (isActive
                ? "bg-[#e53935] text-white shadow-lg font-bold border-l-8 border-[#e53935] ring-2 ring-[#e53935]/40"
                : "text-[#D4D4D4] hover:bg-[#2d2d2d] hover:text-[#e53935] hover:pl-8")
            }
            end
          >
            <span className="text-2xl drop-shadow-lg">{item.icon}</span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-[#D4D4D4] text-sm text-center border-t border-[#e53935] opacity-70 mt-auto bg-[#1f1f1f]">GymPro © 2024</div>
    </aside>
  );
} 