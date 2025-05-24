import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './TrainerHeader.module.css';
import defaultAvatar from '../../../assets/cute-character.jpg';

const TrainerHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/trainer/login');
  };

  return (
    <header className={`${styles.header} ${styles.headerFixed}`}>
      <div className={styles.leftSection}>
        {/* Có thể thêm breadcrumb ở đây nếu muốn */}
      </div>
      <div className={styles.rightSection}>
        <div className={styles.userMenu}>
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
              <button onClick={() => navigate('/trainer/settings')}>Cài đặt</button>
              <button onClick={handleLogout}>Đăng xuất</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TrainerHeader; 