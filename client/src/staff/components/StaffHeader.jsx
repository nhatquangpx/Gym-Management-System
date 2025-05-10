import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';

export default function StaffHeader() {
  // Giả lập thông tin quản lý, sau này lấy từ context hoặc API
  const manager = {
    name: 'Quản lý Gym',
    avatar: 'https://i.pravatar.cc/150?img=12',
    notifications: 2,
  };
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#232323] border-b-2 border-[#e53935] shadow">
      <h1 className="text-2xl font-bold text-white tracking-wide">GymPro STAFF</h1>
      <div className="flex items-center gap-6">
        <div className="relative">
          <NotificationsIcon className="text-white text-3xl cursor-pointer" />
          {manager.notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#e53935] text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {manager.notifications}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Avatar src={manager.avatar} alt={manager.name} />
          <span className="text-white font-semibold">{manager.name}</span>
        </div>
      </div>
    </header>
  );
} 