import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function StaffHeader() {
  // Giả lập thông tin quản lý, sau này lấy từ context hoặc API
  const manager = {
    name: 'Quản lý Gym',
    avatar: 'https://i.pravatar.cc/150?img=12',
    notifications: 2,
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSettings = () => {
    navigate('/staff/account');
    handleClose();
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    handleClose();
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[var(--admin-header)] border-b border-[var(--admin-border)] shadow">
      <h1 className="text-2xl font-bold text-[var(--admin-text)] tracking-wide">GymPro STAFF</h1>
      <div className="flex items-center gap-6">
        <div className="relative">
          <NotificationsIcon className="text-[var(--admin-primary)] text-3xl cursor-pointer" />
          {manager.notifications > 0 && (
            <span className="absolute -top-2 -right-2 bg-[var(--admin-primary)] text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
              {manager.notifications}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Avatar src={manager.avatar} alt={manager.name} sx={{ cursor: 'pointer' }} onClick={handleAvatarClick} />
          <span className="text-[var(--admin-text)] font-semibold">{manager.name}</span>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={handleSettings}>Cài đặt</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
} 