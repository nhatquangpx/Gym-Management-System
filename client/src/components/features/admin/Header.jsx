import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../../../assets/logo.svg";
import styles from './Header.module.css';

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
    <header className={`${styles.header} ${styles.headerFixed}`}>
      <div className={styles.leftSection}></div>
      <div className={styles.rightSection}>
        <button className={styles.notificationButton}>
          <span className={styles.icon}>🔔</span>
          <span className={styles.badge}>3</span>
        </button>
        <div className={styles.userMenu}>
          <button className={styles.userButton} onClick={handleAvatarClick}>
            <Avatar alt="Admin" src="https://i.pravatar.cc/150?img=32" className={styles.avatar} />
            <span className={styles.userName}>Admin CJ</span>
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