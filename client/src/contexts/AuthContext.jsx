import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([
    // Dữ liệu mẫu cho thông báo
    {
      id: 1,
      title: "Chào mừng bạn đến với GYMPRO",
      message: "Khám phá các tính năng mới của chúng tôi",
      isRead: false,
      timestamp: new Date()
    }
  ]);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(notifications.map(notif => 
      notif.id === notificationId ? { ...notif, isRead: true } : notif
    ));
  };

  return (
    <AuthContext.Provider value={{
      isLoggedIn,
      user,
      notifications,
      login,
      logout,
      markNotificationAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
