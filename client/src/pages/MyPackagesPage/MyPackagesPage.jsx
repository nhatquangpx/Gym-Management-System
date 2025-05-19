import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import styles from './MyPackagesPage.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Dữ liệu mẫu lấy từ PackagesSection.jsx
const allPackages = [
  {
    id: 1,
    name: "Gói Linh Hoạt",
    price: "500,000đ",
    period: "/tháng",
    type: "Tự tập",
    description: "Phù hợp cho người mới bắt đầu hoặc muốn duy trì thói quen tập luyện.",
    highlight: true,
  },
  {
    id: 2,
    name: "Gói Chuyên Sâu PT",
    price: "1,200,000đ",
    period: "/tháng",
    type: "Tập với PT",
    description: "Đạt mục tiêu nhanh hơn với sự hướng dẫn 1:1 từ huấn luyện viên chuyên nghiệp.",
  },
  {
    id: 3,
    name: "Gói Toàn Diện VIP",
    price: "2,000,000đ",
    period: "/tháng",
    type: "Tập với PT",
    description: "Trải nghiệm dịch vụ cao cấp nhất với nhiều đặc quyền và hỗ trợ toàn diện.",
  }
];

// Dữ liệu mẫu lịch sử sử dụng và buổi tập
const sampleHistory = [
  {
    id: 1,
    name: "Gói Linh Hoạt",
    start: "2025/03/01",
    end: "2025/04/30",
    status: "Đã hết hạn",
    remaining: 0,
    sessions: [
      { date: "2025/03/02", workout: "Cardio + Ngực" },
      { date: "2025/03/05", workout: "Lưng xô" },
      { date: "2025/03/10", workout: "Chân + Bụng" },
      { date: "2025/03/15", workout: "Vai + Cardio" },
      { date: "2025/03/20", workout: "Tay trước, Tay sau" },
      { date: "2025/03/25", workout: "Fullbody" },
      { date: "2025/04/01", workout: "Yoga" },
      { date: "2025/04/10", workout: "Cardio nhẹ" },
    ]
  },
  {
    id: 2,
    name: "Gói Chuyên Sâu PT",
    start: "2025/05/01",
    end: "2025/06/30",
    status: "Đang sử dụng",
    remaining: 5,
    sessions: [
      { date: "2025/05/02", workout: "PT: Ngực + Cardio" },
      { date: "2025/05/05", workout: "PT: Lưng + Tay" },
      { date: "2025/05/10", workout: "PT: Chân" },
      { date: "2025/05/15", workout: "PT: Vai + Bụng" },
      { date: "2025/05/20", workout: "PT: Cardio" },
    ]
  }
];

const MyPackagesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Sắp xếp lịch sử theo thời gian mới nhất lên đầu
  const sortedHistory = [...sampleHistory].sort((a, b) => new Date(b.end) - new Date(a.end));
  const currentHistory = sortedHistory.find(h => h.status === 'Đang sử dụng');
  const currentPackage = currentHistory ? allPackages.find(p => p.name === currentHistory.name) : null;
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [expandedHistory, setExpandedHistory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      // Giả lập payload, thực tế cần userId, packageId...
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
        <div className={styles.container}>
          <h1 className={styles.title}>Gói tập của tôi</h1>
          <section className={styles.currentPackageSection}>
            <h2>Gói hiện tại</h2>
            <div className={styles.packageInfoBox}>
              <div>
                <h3>{hasCurrent ? currentPackage.name : 'Chưa có gói tập'}</h3>
                {hasCurrent && <>
                  <p><strong>Loại:</strong> {currentPackage.type}</p>
                  <p><strong>Thời hạn:</strong> {currentHistory.start} - {currentHistory.end}</p>
                  <p><strong>Mô tả:</strong> {currentPackage.description}</p>
                </>}
                {!hasCurrent && <p>Bạn chưa đăng ký gói tập nào.</p>}
              </div>
              <div className={styles.packageStats}>
                {hasCurrent && <>
                  <div className={styles.remainingBox}>
                    <span className={styles.remainingLabel}>Số buổi còn lại</span>
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
              {!hasCurrent && (
                <Button onClick={() => handleAction('register', allPackages[0])} className={styles.registerButton}>
                  Đăng ký gói tập
                </Button>
              )}
            </div>
          </section>

          <section className={styles.historySection}>
            <h2>Lịch sử sử dụng gói tập</h2>
            <div className={styles.historyTableWrapper}>
              <table className={styles.historyTable}>
                <thead>
                  <tr>
                    <th>Tên gói</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Số buổi còn lại</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sortedHistory.map(pkg => (
                    <>
                      <tr key={pkg.id}>
                        <td>{pkg.name}</td>
                        <td>{pkg.start} - {pkg.end}</td>
                        <td>{pkg.status}</td>
                        <td>{pkg.remaining}</td>
                        <td>
                          <Button size="small" onClick={() => toggleHistory(pkg.id)}>
                            {expandedHistory[pkg.id] ? 'Ẩn các buổi tập' : 'Xem các buổi tập'}
                          </Button>
                        </td>
                      </tr>
                      {expandedHistory[pkg.id] && (
                        <tr>
                          <td colSpan={5} className={styles.usageDatesCell}>
                            <div className={styles.usageDatesList}>
                              <strong>Các buổi tập đã sử dụng:</strong>
                              <div className={styles.sessionsGrid}>
                                {pkg.sessions.map((s, idx) => (
                                  <div key={s.date} className={styles.sessionItem}>
                                    <span className={styles.sessionDate}>{s.date}</span>
                                    <span className={styles.sessionWorkout}>{s.workout}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
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
            </h2>
            <div className={styles.paymentModalInfo}>
              <p><strong>Tên gói:</strong> {selectedPackage?.name}</p>
              <p><strong>Loại:</strong> {selectedPackage?.type}</p>
              <p><strong>Mô tả:</strong> {selectedPackage?.description}</p>
              <p><strong>Giá:</strong> <span className={styles.paymentModalPrice}>{selectedPackage?.price}{selectedPackage?.period}</span></p>
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