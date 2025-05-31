import React, { useState, useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import Button from '../../../components/common/Button/Button';
import styles from './MyPackagesPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../../utils/axiosConfig';

const MyPackagesPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [allPackages, setAllPackages] = useState([]);
  const [packageHistory, setPackageHistory] = useState([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Fetch packages available in the system
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/api/packages');
        const formattedPackages = response.data.map(pkg => ({
          id: pkg._id,
          name: pkg.name,
          price: `${pkg.price.toLocaleString()}đ`,
          period: `/${pkg.period}`,
          type: pkg.type === 'personal_training' ? 'Tập với PT' : 'Tự tập',
          description: pkg.description,
          highlight: pkg.price < 600000, // Highlight affordable options
        }));
        setAllPackages(formattedPackages);
      } catch (error) {
        console.error('Error fetching packages:', error);
        setError('Không thể tải danh sách gói tập. Vui lòng thử lại sau.');
      } finally {
        setIsLoadingPackages(false);
      }
    };
    
    fetchPackages();
  }, []);
    // Fetch user's package history
  useEffect(() => {    const fetchUserPackages = async () => {
      try {
        // Kiểm tra token (thử cả hai loại token được lưu)
        const token = localStorage.getItem('token') || localStorage.getItem('authToken');
        if (!token) {
          console.log('No token found, user might not be logged in');
          setIsLoadingHistory(false);
          return;
        }
        
        console.log('Fetching user packages...');
        const response = await axios.get('/api/users/my-packages');
        console.log('User packages response:', response.data);
        
        // Kiểm tra nếu không có packages hoặc mảng rỗng
        if (!response.data.packages || response.data.packages.length === 0) {
          console.log('No packages found for user');
          setPackageHistory([]);
          setIsLoadingHistory(false);
          return;
        }        
        const formattedHistory = response.data.packages.map((pkg, index) => {
          if (!pkg) {
            console.log('Package data is null or undefined at index', index);
            return null;
          }
          
          console.log('Processing package:', pkg);
          
          let startDate, endDate;
          const today = new Date();
          
          if (pkg.startDate && pkg.endDate) {
            startDate = new Date(pkg.startDate);
            endDate = new Date(pkg.endDate);
            console.log(`Package ${pkg.name}: ${startDate.toISOString()} to ${endDate.toISOString()}`);
          } else {
            console.log('No date data from API, using fallback dates');
            const isActive = index === 0; // Assume most recent package is active
            startDate = new Date(today);
            endDate = new Date(today);
            
            if (isActive) {
              endDate.setMonth(today.getMonth() + 1);
            } else {
              startDate.setMonth(today.getMonth() - (index + 1));
              endDate = new Date(startDate);
              endDate.setMonth(startDate.getMonth() + 1);
            }
          }
          
          const isActive = endDate > today;
          const daysDiff = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
          const remaining = isActive ? Math.max(0, daysDiff) : 0;
          
          return {
            id: pkg._id,
            name: pkg.name,
            start: startDate.toISOString().split('T')[0].replace(/-/g, '/'),
            end: endDate.toISOString().split('T')[0].replace(/-/g, '/'),
            status: isActive ? 'Đang sử dụng' : 'Đã hết hạn',
            remaining: remaining,
            sessions: pkg.sessions || [] // If the API doesn't return sessions, provide an empty array
          };
        }).filter(pkg => pkg !== null); // Lọc bỏ các mục null
          console.log('Formatted history:', formattedHistory);
        
        const sortedHistory = formattedHistory.sort((a, b) => {
          if (a.status === 'Đang sử dụng' && b.status !== 'Đang sử dụng') return -1;
          if (b.status === 'Đang sử dụng' && a.status !== 'Đang sử dụng') return 1;
          
          return new Date(b.end.replace(/\//g, '-')) - new Date(a.end.replace(/\//g, '-'));
        });
        
        setPackageHistory(sortedHistory);
      } catch (error) {
        console.error('Error fetching user packages:', error);
        setError('Không thể tải lịch sử gói tập. Vui lòng thử lại sau.');
      } finally {
        setIsLoadingHistory(false);
      }
    };
    
    fetchUserPackages();
  }, []);
  
  // Process data for display
  const sortedHistory = [...packageHistory].sort((a, b) => new Date(b.end) - new Date(a.end));
  const currentHistory = sortedHistory.find(h => h.status === 'Đang sử dụng');
  const currentPackage = currentHistory ? allPackages.find(p => p.id === currentHistory.id) : null;

  // Xử lý mở popup xác nhận
  const handleAction = (action, pkg) => {
    setModalAction(action);
    setSelectedPackage(pkg);
    setShowModal(true);
    setError('');
  };

  // Gọi API lấy paymentUrl và chuyển hướng VNPay
  const handlePayment = async () => {
    setLoading(true);
    setError('');
    try {
      const payload = {
        userId: user?.id,
        packageId: selectedPackage.id,
        packageName: selectedPackage.name,
        price: selectedPackage.price,
      };
      const response = await fetch('http://localhost:8001/api/payment/vnpay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setError('Không thể kết nối cổng thanh toán.');
        setLoading(false);
        return;
      }
      const data = await response.json();
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setError('Không lấy được link thanh toán.');
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi kết nối máy chủ.');
    }
    setLoading(false);
  };

  // Toggle xem chi tiết buổi tập
  const toggleHistory = (id) => {
    setExpandedHistory(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Kiểm tra trạng thái để hiển thị nút phù hợp
  const hasCurrent = !!currentHistory;
  const isExpired = hasCurrent && currentHistory.status === 'Đã hết hạn';
  const isActive = hasCurrent && currentHistory.status === 'Đang sử dụng';

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>          <h1 className={styles.title}>Gói tập của tôi</h1>
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <section className={styles.currentPackageSection}>
            <h2>Gói hiện tại</h2>
            {isLoadingPackages || isLoadingHistory ? (
              <div className={styles.loadingState}>Đang tải thông tin gói tập...</div>
            ) : (
              <>
                <div className={styles.packageInfoBox}>
                  <div>
                    <h3>{hasCurrent ? currentPackage?.name : 'Chưa có gói tập'}</h3>
                    {hasCurrent && currentPackage && <>
                      <p><strong>Loại:</strong> {currentPackage.type}</p>
                      <p><strong>Thời hạn:</strong> {currentHistory.start} - {currentHistory.end}</p>
                      <p><strong>Mô tả:</strong> {currentPackage.description}</p>
                    </>}
                    {!hasCurrent && <p>Bạn chưa đăng ký gói tập nào.</p>}
                  </div>
                  <div className={styles.packageStats}>                    {hasCurrent && <>
                      <div className={styles.remainingBox}>
                        <span className={styles.remainingLabel}>Số ngày còn lại</span>
                        <span className={styles.remainingValue}>{currentHistory.remaining}</span>
                      </div>
                      <div className={styles.statusBox}>
                        <span className={styles.statusLabel}>Trạng thái</span>
                        <span className={styles.statusValue}>{currentHistory.status}</span>
                      </div>
                    </>}
                  </div>
                </div>
                <div className={styles.actionButtons}>
                  {isExpired && (
                    <Button onClick={() => handleAction('renew', currentPackage)} className={styles.renewButton}>
                      Gia hạn gói tập
                    </Button>
                  )}
                  {isActive && (
                    <Button onClick={() => handleAction('buyMore', currentPackage)} className={styles.buyMoreButton}>
                      Mua thêm gói tập
                    </Button>
                  )}
                  {!hasCurrent && allPackages.length > 0 && (
                    <Button onClick={() => handleAction('register', allPackages[0])} className={styles.registerButton}>
                      Đăng ký gói tập
                    </Button>
                  )}
                </div>
              </>
            )}
          </section>

          <section className={styles.historySection}>
            <h2>Lịch sử sử dụng gói tập</h2>            
            {isLoadingHistory ? (
              <div className={styles.loadingState}>Đang tải lịch sử gói tập...</div>
            ) : sortedHistory.length === 0 ? (
              <div className={styles.noHistoryMessage}>
                <p>Chưa có lịch sử sử dụng gói tập nào.</p>
                <small>Nếu bạn đã thanh toán gói tập, vui lòng thử đăng xuất và đăng nhập lại.</small>
                <p className={styles.debugInfo}>Debug: {JSON.stringify({auth: !!localStorage.getItem('token') || !!localStorage.getItem('authToken')})}</p>
              </div>
            ) : (
              <div className={styles.historyTableWrapper}>
                <table className={styles.historyTable}>
                  <thead>
                    <tr>
                      <th>Tên gói</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th></th>
                  </tr>                
                  </thead>
                <tbody>
                  {sortedHistory.map(pkg => (
                    <React.Fragment key={pkg.id}>
                      <tr>
                        <td>{pkg.name}</td>
                        <td>{pkg.start} - {pkg.end}</td>
                        <td>{pkg.status}</td>
                      </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
      {/* Modal xác nhận thanh toán mới */}
      {showModal && (
        <div className={styles.paymentModalOverlay}>
          <div className={styles.paymentModal}>
            <h2 className={styles.paymentModalTitle}>
              {modalAction === 'renew' ? 'Gia hạn gói tập' : modalAction === 'buyMore' ? 'Mua thêm gói tập' : 'Đăng ký gói tập'}
            </h2>          <div className={styles.paymentModalInfo}>
              <p><strong>Tên gói:</strong> {selectedPackage ? selectedPackage.name : ''}</p>
              <p><strong>Loại:</strong> {selectedPackage ? selectedPackage.type : ''}</p>
              <p><strong>Mô tả:</strong> {selectedPackage ? selectedPackage.description : ''}</p>
              <p><strong>Giá:</strong> <span className={styles.paymentModalPrice}>{selectedPackage ? selectedPackage.price : ''}{selectedPackage ? selectedPackage.period : ''}</span></p>
            </div>
            {error && <div className={styles.paymentModalError}>{error}</div>}
            <div className={styles.paymentModalActions}>
              <Button onClick={handlePayment} className={styles.paymentModalPayBtn} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Thanh toán'}
              </Button>
              <Button onClick={() => setShowModal(false)} className={styles.paymentModalCancelBtn} disabled={loading}>
                Để sau
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPackagesPage; 