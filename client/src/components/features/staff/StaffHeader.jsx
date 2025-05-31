import Avatar from '@mui/material/Avatar';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../../redux/slices/authSlice';
import logo from "../../../assets/logo.svg";
import styles from './StaffHeader.module.css';

export default function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector((state) => state.auth);
  const [apiUser, setApiUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRaw = localStorage.getItem('user');
        if (!userRaw) return;
        const userObj = JSON.parse(userRaw);
        const userId = userObj?.id;
        if (!userId) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/admin/get-user/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setApiUser(data);
        }
      } catch {}
    };
    fetchUser();
  }, []);

  let user = apiUser || reduxUser;
  if (!user) {
    try {
      const userRaw = localStorage.getItem('user');
      if (userRaw) user = JSON.parse(userRaw);
    } catch {}
  }

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
    dispatch(setLogout());
    navigate('/auth/login');
    handleClose();
  };

  return (
    <header className={`${styles.header} ${styles.headerFixed}`}>
      <div className={styles.leftSection}></div>
      <div className={styles.rightSection}>
        <div className={styles.userMenu}>
          <button className={styles.userButton} onClick={handleAvatarClick}>
            <Avatar alt={user?.name || 'Staff'} src={user.avatar} className={styles.avatar} />
            <span className={styles.userName}>{user?.name || 'Staff'}</span>
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