import { useState } from 'react';
import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import Button from '../../../components/common/Button/Button';
import InputField from '../../../components/common/InputField/InputField';
import styles from './ComplaintsPage.module.css';

// Dữ liệu mẫu (replace with API/BE data)
const usedPackages = [
  { id: 1, name: 'Gói Linh Hoạt' },
  { id: 2, name: 'Gói Chuyên Sâu PT' },
];
const usedTrainers = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
];

// Dummy history (replace with BE data)
const sampleHistory = [
  {
    id: 1,
    type: 'Gói tập',
    target: 'Gói Linh Hoạt',
    stars: 5,
    content: 'Gói tập rất tốt, phòng tập sạch sẽ.',
    date: '2025/05/10',
  },
  {
    id: 2,
    type: 'Huấn luyện viên',
    target: 'Nguyễn Văn A',
    stars: 4,
    content: 'HLV nhiệt tình, hướng dẫn kỹ.',
    date: '2025/05/10',
  },
];

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
  const [history, setHistory] = useState(sampleHistory);
  const [successMsg, setSuccessMsg] = useState('');
  const [filter, setFilter] = useState('Tất cả');

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setTargetId('');
  };

  const handleSubmit = (e) => {
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
    // TODO: Call BE API to submit feedback
    const newEntry = {
      id: history.length + 1,
      type,
      target:
        type === 'Gói tập'
          ? usedPackages.find((p) => p.id === Number(targetId))?.name
          : usedTrainers.find((t) => t.id === Number(targetId))?.name,
      stars,
      content,
      date: new Date().toISOString().split('T')[0].replace(/-/g, '/'),
    };
    setHistory([newEntry, ...history]);
    setSuccessMsg('Gửi đánh giá thành công!');
    setStars(0);
    setContent('');
    setTargetId('');
    setTimeout(() => setSuccessMsg(''), 2000);
  };

  // Lọc lịch sử theo filter
  const filteredHistory =
    filter === 'Tất cả'
      ? history
      : history.filter((item) =>
          filter === 'Gói tập' ? item.type === 'Gói tập' : item.type === 'Huấn luyện viên'
        );

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <h1 className={styles.title}>Đánh giá & Khiếu nại</h1>
          <form className={styles.feedbackForm} onSubmit={handleSubmit}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
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
              <div className={styles.formGroup}>
                <label className={styles.label}>Chọn {type === 'Gói tập' ? 'gói tập' : 'huấn luyện viên'}</label>
                <select
                  className={styles.selectInput}
                  value={targetId}
                  onChange={e => setTargetId(e.target.value)}
                >
                  <option value="">-- Chọn --</option>
                  {(type === 'Gói tập' ? usedPackages : usedTrainers).map((item) => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
                {errors.targetId && <span className={styles.errorMsg}>{errors.targetId}</span>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Số sao <span className={styles.required}>*</span></label>
                <StarRating value={stars} onChange={setStars} />
                {errors.stars && <span className={styles.errorMsg}>{errors.stars}</span>}
              </div>
              <div className={styles.formGroup}>
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
            {successMsg && <div className={styles.successMsg}>{successMsg}</div>}
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
                onChange={e => setFilter(e.target.value)}
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Gói tập">Gói tập</option>
                <option value="Huấn luyện viên">Huấn luyện viên</option>
              </select>
            </div>
            <div className={styles.historyList}>
              {filteredHistory.length === 0 && <p>Bạn chưa gửi đánh giá nào.</p>}
              {filteredHistory.map((item) => (
                <div key={item.id} className={styles.historyItem}>
                  <div className={styles.historyHeader}>
                    <span className={
                      item.type === 'Gói tập'
                        ? styles.packageType
                        : styles.trainerType
                    }>
                      {item.type}
                    </span>
                    <span className={styles.historyTarget}>{item.target}</span>
                    <span className={styles.historyStars}>{'★'.repeat(item.stars)}{'☆'.repeat(5 - item.stars)}</span>
                    <span className={styles.historyDate}>{item.date}</span>
                  </div>
                  {item.content && <div className={styles.historyContent}>{item.content}</div>}
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