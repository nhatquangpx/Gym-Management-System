import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import { useAuth } from '../../../contexts/AuthContext';
import Button from '../../common/Button/Button';
import logo from '../../../assets/logo.svg';
import Modal from '../../common/Modal/Modal';

const Navbar = () => {
  const { isLoggedIn, user, logout, notifications } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const homeNavItems = [
    { name: 'Dịch Vụ', path: '#services-section' },
    { name: 'Trang Thiết Bị', path: '#equipment-section' },
    { name: 'Gói Tập', path: '#packages-section' },
    { name: 'Huấn Luyện Viên', path: '#trainers-section' },
    { name: 'Blog', path: '#blog-section' },
  ];

  const loggedInNavItems = [
    { name: 'Lịch tập', path: '/schedule' },
    { name: 'Gói tập của tôi', path: '/my-packages' },
    { name: 'Đánh giá & Khiếu nại', path: '/complaints' },
  ];

  const handleScrollToSection = (path) => {
    const element = document.querySelector(path);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthenticatedNavigation = (path) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
      setPendingNavigation(path);
      return;
    }
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const handleLogoClick = (e) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConfirmLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  const handleAvatarClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link to="/" className={styles.logoContainer} onClick={handleLogoClick}>
            <img src={logo} alt="GYMPRO Logo" className={styles.logo} />  
            <span className={styles.logoName}>GYMPRO</span>
          </Link>

          <ul className={styles.navMenu}>
            {(isLoggedIn ? loggedInNavItems : homeNavItems).map((item) => (
              <li key={item.name} className={styles.navItem}>
                {isLoggedIn ? (
                  <button 
                    onClick={() => handleAuthenticatedNavigation(item.path)}
                    className={styles.navLink}
                  >
                    {item.name}
                  </button>
                ) : (
                  <button 
                    onClick={() => handleScrollToSection(item.path)}
                    className={styles.navLink}
                  >
                    {item.name}
                  </button>
                )}
              </li>
            ))}
          </ul>

          <div className={styles.navAuth}>
            {isLoggedIn ? (
              <>
                {/* Notification Bell */}
                <div className={styles.notificationContainer} ref={notificationRef}>
                  <button 
                    className={styles.notificationButton}
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <i className="material-icons">notifications</i>
                    {unreadNotifications > 0 && (
                      <span className={styles.notificationBadge}>
                        {unreadNotifications}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className={styles.notificationDropdown}>
                      <h3>Thông báo</h3>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`${styles.notificationItem} ${!notification.isRead ? styles.unread : ''}`}
                          >
                            <div className={styles.notificationContent}>
                              <h4>{notification.title}</h4>
                              <p>{notification.message}</p>
                              <small>{new Date(notification.timestamp).toLocaleDateString()}</small>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className={styles.noNotifications}>Không có thông báo mới</p>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile */}
                <div className={styles.userProfile} ref={dropdownRef}>
                  <div 
                    className={`${styles.userAvatar} ${!user?.avatar ? styles.defaultAvatar : ''}`}
                    onClick={handleAvatarClick}
                  >
                    {user?.avatar && <img src={user.avatar} alt="" />}
                  </div>
                  {showDropdown && (
                    <div className={styles.dropdownMenu}>
                      <div className={styles.dropdownHeader}>
                        <div className={`${styles.dropdownAvatar} ${!user?.avatar ? styles.defaultAvatar : ''}`}>
                          {user?.avatar && <img src={user.avatar} alt="" />}
                        </div>
                        <div className={styles.userInfo}>
                          <h4>{user?.name || 'User'}</h4>
                          <p>{user?.email || 'email@example.com'}</p>
                        </div>
                      </div>
                      <div className={styles.dropdownDivider}></div>
                      <Link to="/profile/edit" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                        <i className="material-icons">person</i>
                        Chỉnh sửa thông tin
                      </Link>
                      <Link to="/settings" className={styles.dropdownItem} onClick={() => setShowDropdown(false)}>
                        <i className="material-icons">settings</i>
                        Cài đặt
                      </Link>
                      <button onClick={handleLogout} className={styles.dropdownItem}>
                        <i className="material-icons">logout</i>
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/register/package" className={`${styles.navButton} ${styles.registerButton}`}>
                  Đăng ký
                </Link>
                <Link to="/login" className={`${styles.navButton} ${styles.loginButton}`}>
                  Đăng nhập
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Modal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onConfirm={handleConfirmLogin}
        title="Yêu cầu đăng nhập"
        message="Bạn cần đăng nhập để sử dụng tính năng này. Bạn có muốn đăng nhập không?"
      />
    </>
  );
};

export default Navbar;
