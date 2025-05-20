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
import logo from '../../assets/logo.svg';

const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
  { name: "Thành viên", path: "/admin/members", icon: <GroupIcon /> },
  { name: "Nhân viên/Huấn luyện viên", path: "/admin/employees", icon: <PeopleIcon /> },
  { name: "Gói tập", path: "/admin/packages", icon: <FitnessCenterIcon /> },
  { name: "Đơn hàng/Thanh toán", path: "/admin/orders", icon: <ReceiptLongIcon /> },
  { name: "Thiết bị", path: "/admin/equipment", icon: <BuildIcon /> },
  { name: "Lịch sử tập luyện", path: "/admin/workouts", icon: <HistoryIcon /> },
  { name: "Lịch tập", path: "/admin/schedules", icon: <CalendarMonthIcon /> },
  { name: "Phản hồi", path: "/admin/feedback", icon: <FeedbackIcon /> },
  { name: "Tài khoản admin", path: "/admin/account", icon: <AccountCircleIcon /> },
];

export default function Sidebar() {
  // Danh sách các path cần đổi màu icon khi active
  const whiteIconPaths = [
    '/admin/equipment',
    '/admin/workouts',
    '/admin/schedules',
    '/admin/feedback',
  ];
  return (
    <aside className="w-64 bg-[#1f1f1f] shadow-2xl h-screen sticky top-0 flex flex-col border-r-4 border-[#e53935]">
      <div className="p-6 text-2xl font-extrabold text-white border-b border-[#e53935] flex items-center justify-center bg-gradient-to-r from-[#e53935] to-[#b71c1c] shadow-lg">
        <img src={logo} alt="GYMPRO Logo" style={{ height: 40, marginRight: 12 }} /> <span className="drop-shadow-lg tracking-wider">GYMPRO ADMIN</span>
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
            <span className={
              `text-2xl drop-shadow-lg` +
              ((whiteIconPaths.includes(item.path) && window.location.pathname.startsWith(item.path)) ? ' text-white' : '')
            }>
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-[#D4D4D4] text-sm text-center border-t border-[#e53935] opacity-70 mt-auto bg-[#1f1f1f]">GymPro © 2024</div>
    </aside>
  );
} 