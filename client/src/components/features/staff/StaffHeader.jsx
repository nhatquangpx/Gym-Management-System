import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.svg";
import styles from './StaffHeader.module.css';

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
    <header className={`${styles.header} ${styles.headerFixed}`}>
      <div className={styles.leftSection}></div>
      <div className={styles.rightSection}>
        <div className={styles.userMenu}>
          <button className={styles.userButton} onClick={handleAvatarClick}>
            <Avatar src={manager.avatar} alt={manager.name} className={styles.avatar} />
            <span className={styles.userName}>{manager.name}</span>
          </button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
            <MenuItem onClick={handleSettings}>Cài đặt</MenuItem>
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
} 