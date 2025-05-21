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
    <aside className="w-64 bg-[var(--admin-sidebar)] shadow-lg h-screen sticky top-0 flex flex-col border-r border-[var(--admin-border)]">
      <div className="py-8 px-4 text-2xl font-extrabold text-[var(--admin-text)] border-b border-[var(--admin-border)] flex flex-col items-center justify-center bg-[var(--admin-header)]">
        <img src={logo} alt="GYMPRO Logo" style={{ height: 48, marginBottom: 8 }} />
        <span className="tracking-wider text-xl mt-1">GYMPRO ADMIN</span>
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
            <span className={
              `text-2xl` +
              ((whiteIconPaths.includes(item.path) && window.location.pathname.startsWith(item.path)) ? ' text-[var(--admin-primary)]' : '')
            }>
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 text-[var(--admin-text)] text-sm text-center border-t border-[var(--admin-border)] opacity-70 mt-auto bg-[var(--admin-sidebar)]">GymPro © 2024</div>
    </aside>
  );
} 