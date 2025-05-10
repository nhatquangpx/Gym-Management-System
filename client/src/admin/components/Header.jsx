import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';

export default function Header() {
  return (
    <header className="flex items-center justify-between bg-[#1f1f1f] shadow-2xl px-10 py-5 mb-8 rounded-2xl border-b-4 border-[#e53935]">
      <div className="text-3xl font-extrabold text-white tracking-wider drop-shadow-lg flex items-center gap-2">
        <span className="text-[#e53935] text-4xl animate-pulse">🏋️‍♂️</span> GymPro ADMIN
      </div>
      <div className="flex items-center gap-8">
        <button className="relative group">
          <NotificationsIcon className="text-[#e53935]" fontSize="large" />
          <span className="absolute -top-2 -right-2 bg-[#e53935] text-white text-xs rounded-full px-1.5 py-0.5 shadow-lg animate-bounce border-2 border-white">3</span>
        </button>
        <div className="flex items-center gap-3">
          <Avatar alt="Admin" src="https://i.pravatar.cc/150?img=32" sx={{ border: '2px solid #e53935', width: 48, height: 48 }} />
          <span className="font-semibold text-white text-lg">Admin CJ</span>
        </div>
      </div>
    </header>
  );
} 