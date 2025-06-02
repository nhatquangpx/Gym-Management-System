import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../../redux/slices/authSlice';
import styles from './TrainerHeader.module.css';
import defaultAvatar from '../../../assets/cute-character.jpg';

const TrainerHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dropdownRef = useRef();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    if (!showUserMenu) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Đóng dropdown khi chuyển route
  useEffect(() => {
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Đăng xuất trong Redux store
    dispatch(setLogout());
    
    // Chuyển hướng đến trang đăng nhập
    navigate('/auth/login');
  };

  return (
    <header className={`${styles.header} ${styles.headerFixed}`}>
      <div className={styles.leftSection}>
        {/* Có thể thêm breadcrumb ở đây nếu muốn */}
      </div>
      <div className={styles.rightSection}>
        <div className={styles.userMenu} ref={dropdownRef}>
          <button
            className={styles.userButton}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <img
              src={user?.avatar || defaultAvatar}
              alt="User Avatar"
              className={styles.avatar}
              onError={e => { e.target.onerror = null; e.target.src = defaultAvatar; }}
            />
            <span className={styles.userName}>{user?.name || 'Trainer'}</span>
          </button>
          {showUserMenu && (
            <div className={styles.userDropdown}>
              <div className={styles.userInfoBox}>
                <img src={user?.avatar || defaultAvatar} alt="Avatar" className={styles.dropdownAvatar} />
                <div>
                  <div className={styles.dropdownName}>{user?.name || 'Trainer'}</div>
                  <div className={styles.dropdownEmail}>{user?.email || 'trainer@gympro.com'}</div>
                  <div className={styles.dropdownRole}>Huấn luyện viên</div>
                </div>
              </div>
              <button onClick={() => navigate('/trainer/profile')}>Thông tin cá nhân</button>
              <button onClick={() => navigate('/trainer/change-password')}>Đổi mật khẩu</button>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TrainerHeader; 