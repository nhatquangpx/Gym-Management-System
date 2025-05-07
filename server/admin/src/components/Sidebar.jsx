import { NavLink } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { name: "Thành viên", path: "/members", icon: <GroupIcon /> },
  { name: "Nhân viên/Huấn luyện viên", path: "/employees", icon: <PeopleIcon /> },
  { name: "Gói tập", path: "/packages", icon: <FitnessCenterIcon /> },
  { name: "Đơn hàng/Thanh toán", path: "/orders", icon: <ReceiptLongIcon /> },
  { name: "Tài khoản admin", path: "/account", icon: <AccountCircleIcon /> },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#1f1f1f] shadow-2xl h-screen sticky top-0 flex flex-col rounded-r-3xl border-r-4 border-[#e53935]">
      <div className="p-6 text-2xl font-extrabold text-white border-b border-[#e53935] flex items-center justify-center bg-gradient-to-r from-[#e53935] to-[#b71c1c] rounded-tr-3xl shadow-lg">
        <span className="mr-2 text-3xl animate-pulse">🏋️‍♂️</span> <span className="drop-shadow-lg tracking-wider">CJ GYM ADMIN</span>
      </div>
      <nav className="mt-6 flex-1">
        {menu.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-lg rounded-l-full transition-all duration-300 mb-2 font-medium gap-3 ` +
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
      <div className="p-4 text-[#D4D4D4] text-sm text-center border-t border-[#e53935] opacity-70">CJ Gym © 2024</div>
    </aside>
  );
} 