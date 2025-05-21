import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.svg";

export default function Header() {
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
    navigate('/admin/account');
    handleClose();
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    handleClose();
  };

  return (
    <header className="flex items-center justify-between bg-[var(--admin-header)] shadow-lg px-10 py-3 mb-4 border-b border-[var(--admin-border)]">
      <div className="flex items-center gap-4">
        <img src={logo} alt="GYMPRO Logo" style={{ height: 30 }} />
        <span className="text-xl font-extrabold text-[var(--admin-text)] tracking-wider">GYMPRO ADMIN</span>
      </div>
      <div className="flex items-center gap-8">
        <button className="relative group">
          <NotificationsIcon className="text-[var(--admin-primary)]" fontSize="medium" />
          <span className="absolute -top-1 -right-1 bg-[var(--admin-primary)] text-white text-xs rounded-full px-1 py-0.5 shadow-lg animate-bounce border border-white">3</span>
        </button>
        <div className="flex items-center gap-2">
          <Avatar alt="Admin" src="https://i.pravatar.cc/150?img=32" sx={{ border: `2px solid var(--admin-primary)`, width: 40, height: 40, cursor: 'pointer' }} onClick={handleAvatarClick} />
          <span className="font-semibold text-[var(--admin-text)] text-base">Admin CJ</span>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={handleSettings}>Cài đặt</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
} 