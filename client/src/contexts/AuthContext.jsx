import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
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

  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (userData, authToken) => {
    setIsLoggedIn(true);
    setUser(userData);
    setToken(authToken);
    
    // Store in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setToken(null);
    
    // Clear from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
      token,
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
