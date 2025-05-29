import { useState, useEffect } from 'react';
import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import Button from '../../../components/common/Button/Button';
import InputField from '../../../components/common/InputField/InputField';
import styles from './ComplaintsPage.module.css';

// Star rating component
function StarRating({ value, onChange }) {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={star <= value ? styles.filledStar : styles.emptyStar}
          onClick={() => onChange(star)}
          role="button"
          tabIndex={0}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

const ComplaintsPage = () => {
  const [type, setType] = useState('Gói tập');
  const [targetId, setTargetId] = useState('');
  const [stars, setStars] = useState(0);
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState({});
  const [history, setHistory] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const [filter, setFilter] = useState('Tất cả');
  const [usedPackages, setUsedPackages] = useState([]);
  const [usedTrainers, setUsedTrainers] = useState([]);

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setTargetId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {};
    if (!targetId) {
      newErrors.targetId = 'Vui lòng chọn đối tượng đánh giá';
      valid = false;
    }
    if (!stars) {
      newErrors.stars = 'Vui lòng chọn số sao';
      valid = false;
    }
    setErrors(newErrors);
    if (!valid) return;
    // Gọi API gửi feedback
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8001/api/feedbacks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        type,
        star: stars,
        text: content,
        targetId
      })
    });
    const data = await res.json();
    if (data.success) {
      setSuccessMsg('Gửi đánh giá thành công!');
      setStars(0);
      setContent('');
      setTargetId('');
      fetchFeedbackHistory(filter); // reload history
      setTimeout(() => setSuccessMsg(''), 2000);
    } else {
      setErrors({ submit: data.message || 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
  };

  // Lọc lịch sử theo filter
  const filteredHistory =
    filter === 'Tất cả'
      ? history
      : history.filter((item) =>
          filter === 'Gói tập' ? item.type === 'Gói tập' : item.type === 'Huấn luyện viên'
        );

  const fetchUsedPackages = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8001/api/feedbacks/used-packages', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await res.json();
    console.log('usedPackages from server:', data);
    if (data.success) {
      setUsedPackages(data.data);
    }
  };

  const fetchUsedTrainers = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8001/api/feedbacks/used-trainers', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await res.json();
    if (data.success) {
      setUsedTrainers(data.data);
    }
  };

  const fetchFeedbackHistory = async (filterType = 'Tất cả') => {
    const token = localStorage.getItem('token');
    let url = 'http://localhost:8001/api/feedbacks/history';
    if (filterType && filterType !== 'Tất cả') {
      url += `?type=${encodeURIComponent(filterType)}`;
    }
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    const data = await res.json();
    if (data.success) {
      setHistory(data.data);
    }
  };

  useEffect(() => {
    fetchUsedPackages();
    fetchUsedTrainers();
    fetchFeedbackHistory();
  }, []);

  // Lấy tên đối tượng từ id
  const getTargetName = (item) => {
    if (item.type === 'Gói tập') {
      const pkg = usedPackages.find(p => p._id === (item.targetId || item.packageId));
      return pkg ? pkg.name : 'Gói tập';
    } else {
      const trainer = usedTrainers.find(t => t._id === (item.targetId || item.trainerId));
      return trainer ? trainer.name : 'Huấn luyện viên';
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Đánh giá & Khiếu nại</h1>
          <form className={styles.feedbackForm} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              {/* Hàng 1: 2 select */}
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label className={styles.label}>Đánh giá cho</label>
                  <select
                    className={styles.selectInput}
                    value={type}
                    onChange={handleTypeChange}
                  >
                    <option value="Gói tập">Gói tập</option>
                    <option value="Huấn luyện viên">Huấn luyện viên</option>
                  </select>
                </div>
                <div className={styles.formGroup} style={{flex: 1}}>
                  <label className={styles.label}>Chọn {type === 'Gói tập' ? 'gói tập' : 'huấn luyện viên'}</label>
                  <select
                    className={styles.selectInput}
                    value={targetId}
                    onChange={e => setTargetId(e.target.value)}
                  >
                    <option value="">-- Chọn --</option>
                    {(type === 'Gói tập' ? usedPackages : usedTrainers).map((item) => (
                      <option key={item._id} value={item._id}>{item.name}</option>
                    ))}
                  </select>
                  {errors.targetId && <span className={styles.errorMsg}>{errors.targetId}</span>}
                </div>
              </div>
              {/* Hàng 2: Số sao */}
              <div className={styles.formRow}>
                <div className={styles.starRow}>
                  <label className={styles.label} style={{marginBottom: 0}}>Số sao <span className={styles.required}>*</span></label>
                  <StarRating value={stars} onChange={setStars} />
                </div>
                {errors.stars && <span className={styles.errorMsg}>{errors.stars}</span>}
              </div>
              {/* Hàng 3: Nội dung đánh giá */}
              <div className={styles.formRow}>
                <div className={styles.formGroup} style={{width: '100%'}}>
                  <label className={styles.label}>Nội dung đánh giá</label>
                  <textarea
                    className={styles.textareaInput}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Nhập nội dung đánh giá (không bắt buộc)"
                    rows={4}
                  />
                </div>
              </div>
            </div>
            {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
            {errors.submit && <div className={styles.errorMsg}>{errors.submit}</div>}
            <div className={styles.buttonGroup}>
              <Button type="button" className={styles.backButton} onClick={() => window.history.back()}>
                Quay lại
              </Button>
              <Button type="submit" className={styles.submitButton}>
                Gửi đánh giá
              </Button>
            </div>
          </form>

          <section className={styles.historySection}>
            <div className={styles.historyHeaderRow}>
              <h2>Lịch sử đánh giá đã gửi</h2>
              <select
                className={styles.filterSelect}
                value={filter}
                onChange={e => {
                  setFilter(e.target.value);
                  fetchFeedbackHistory(e.target.value);
                }}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Gói tập">Gói tập</option>
                <option value="Huấn luyện viên">Huấn luyện viên</option>
              </select>
            </div>
            <div className={styles.historyList}>
              {filteredHistory.length === 0 && <p>Bạn chưa gửi đánh giá nào.</p>}
              {filteredHistory.map((item) => (
                <div key={item._id} className={styles.historyItem}>
                  <div className={styles.historyHeader}>
                    <span className={
                      item.type === 'Gói tập'
                        ? styles.packageType
                        : styles.trainerType
                    }>
                      {item.type}
                    </span>
                    <span className={styles.historyTarget}>{getTargetName(item)}</span>
                    <span className={styles.historyStars}>{'★'.repeat(item.star)}{'☆'.repeat(5 - item.star)}</span>
                    <span className={styles.historyDate}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                  {item.text && <div className={styles.historyContent}>{item.text}</div>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComplaintsPage; 