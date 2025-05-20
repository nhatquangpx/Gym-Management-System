import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';

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
    <header className="flex items-center justify-between bg-[#1f1f1f] shadow-2xl px-10 py-5 mb-8 border-b-4 border-[#e53935]">
      <div className="flex items-center gap-3">
        <img src={logo} alt="GYMPRO Logo" style={{ height: 40 }} />
        <span className="text-3xl font-extrabold text-white tracking-wider drop-shadow-lg">GYMPRO ADMIN</span>
      </div>
      <div className="flex items-center gap-8">
        <button className="relative group">
          <NotificationsIcon className="text-[#e53935]" fontSize="large" />
          <span className="absolute -top-2 -right-2 bg-[#e53935] text-white text-xs rounded-full px-1.5 py-0.5 shadow-lg animate-bounce border-2 border-white">3</span>
        </button>
        <div className="flex items-center gap-3">
          <Avatar alt="Admin" src="https://i.pravatar.cc/150?img=32" sx={{ border: '2px solid #e53935', width: 48, height: 48, cursor: 'pointer' }} onClick={handleAvatarClick} />
          <span className="font-semibold text-white text-lg">Admin CJ</span>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={handleSettings}>Cài đặt</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
} 