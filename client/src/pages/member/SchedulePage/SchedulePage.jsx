import React, { useState } from 'react';
import Navbar from '../../../components/layout/Navbar/Navbar';
import Footer from '../../../components/layout/Footer/Footer';
import { FaChevronLeft, FaChevronRight, FaPlus, FaEdit, FaTrash, FaTimes, FaRegCalendarAlt } from 'react-icons/fa';
import styles from './SchedulePage.module.css';

// Hàm lấy các ngày trong tuần
function getWeekDays(baseDate) {
  const week = [];
  const today = new Date(baseDate);
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

// Dữ liệu mẫu cho member
const initialSessions = [
  {
    date: '2025-05-20',
    sessions: [
      { id: 1, startTime: '08:00', endTime: '09:00', detail: 'Tập ngực, vai, tay' },
      { id: 2, startTime: '09:30', endTime: '10:30', detail: 'Yoga cơ bản' },
    ]
  },
  {
    date: '2025-05-21',
    sessions: [
      { id: 3, startTime: '15:00', endTime: '16:00', detail: 'Cardio + HIIT' },
    ]
  },
  {
    date: '2025-05-22',
    sessions: [
      { id: 4, startTime: '08:00', endTime: '09:00', detail: 'Tập lưng, xô' },
    ]
  },
];

const SessionModal = ({ open, onClose, onSave, onDelete, mode, session, selectedDate }) => {
  const [form, setForm] = React.useState(session || { startTime: '', endTime: '', detail: '', date: selectedDate });
  const [error, setError] = React.useState('');
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const dateInputRef = React.useRef();

  React.useEffect(() => {
    setForm(session ? { ...session, date: session.date || selectedDate } : { startTime: '', endTime: '', detail: '', date: selectedDate });
    setError('');
  }, [session, open, selectedDate]);

  if (!open) return null;
  const isEdit = mode === 'edit';
  const isDetail = mode === 'detail';
  const isAdd = mode === 'add';
  const dateStr = new Date(form.date || selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleDateChange = e => {
    setForm({ ...form, date: e.target.value });
  };
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };
  const handleConfirmOverlayClick = (e) => {
    if (e.target === e.currentTarget) setShowConfirmModal(false);
  };
  const handleTryConfirm = (action) => {
    if (action === 'save') {
      if (!form.startTime || !form.endTime || !form.detail || !form.date) {
        setError('Vui lòng nhập đầy đủ thông tin!');
        return;
      }
      if (form.startTime >= form.endTime) {
        setError('Giờ kết thúc phải sau giờ bắt đầu!');
        return;
      }
    }
    setError('');
    setConfirmAction(action);
    setShowConfirmModal(true);
  };
  const handleConfirmAction = () => {
    if (confirmAction === 'save') {
      onSave({ ...form, id: session?.id });
    } else if (confirmAction === 'delete') {
      onDelete(session);
    }
    setShowConfirmModal(false);
  };
  return (
    <div className={styles.sessionModalOverlay} onClick={handleOverlayClick}>
      <div className={styles.sessionModal} onClick={e => e.stopPropagation()}>
        <div className={styles.sessionModalHeader}>
          {isAdd && 'Thêm buổi tập'}
          {isEdit && 'Sửa buổi tập'}
          {isDetail && 'Chi tiết buổi tập'}
          <button className={styles.sessionModalClose} onClick={onClose}><FaTimes /></button>
        </div>
        <div className={styles.sessionModalDate}>
          Ngày:
          {isDetail ? (
            <span style={{ marginLeft: 8 }}>{dateStr}</span>
          ) : (
            <span className={styles.dateInputWrapper}>
              <input
                ref={dateInputRef}
                type="date"
                className={styles.sessionModalInput}
                value={form.date}
                onChange={handleDateChange}
                disabled={isDetail}
                min={new Date().getFullYear() + '-01-01'}
                max={new Date().getFullYear() + 2 + '-12-31'}
              />
              <FaRegCalendarAlt
                className={styles.dateIconCustom}
                onClick={() => dateInputRef.current && dateInputRef.current.showPicker && dateInputRef.current.showPicker()}
                tabIndex={-1}
              />
            </span>
          )}
        </div>
        <form className={styles.sessionModalForm} onSubmit={e => { e.preventDefault(); handleTryConfirm('save'); }}>
          <div className={styles.timeInputs}>
            <div>
              <label className={styles.sessionModalLabel}>Giờ bắt đầu</label>
              <input
                className={styles.sessionModalInput}
                name="startTime"
                type="time"
                value={form.startTime}
                onChange={handleChange}
                disabled={isDetail}
                step="300"
                style={{ fontSize: '1.2em', fontWeight: 600, letterSpacing: 1 }}
              />
            </div>
            <div>
              <label className={styles.sessionModalLabel}>Giờ kết thúc</label>
              <input
                className={styles.sessionModalInput}
                name="endTime"
                type="time"
                value={form.endTime}
                onChange={handleChange}
                disabled={isDetail}
                step="300"
                style={{ fontSize: '1.2em', fontWeight: 600, letterSpacing: 1 }}
              />
            </div>
          </div>
          <label className={styles.sessionModalLabel}>Chi tiết buổi tập</label>
          <input
            className={styles.sessionModalInput}
            name="detail"
            value={form.detail}
            onChange={handleChange}
            disabled={isDetail}
            style={{ fontWeight: isEdit ? 600 : 400 }}
          />
          {/* Không hiển thị error khi chỉ xem chi tiết */}
          {!isDetail && error && <div style={{ color: '#ff1744', fontWeight: 500 }}>{error}</div>}
          <div className={styles.sessionModalFooter}>
            <button type="button" className={`${styles.sessionModalBtn} ${styles.secondary}`} onClick={onClose}>Đóng</button>
            {!isDetail && <button type="submit" className={`${styles.sessionModalBtn} ${styles.primary}`}>{isAdd ? 'Thêm' : 'Lưu'}</button>}
            {isEdit && onDelete && <button type="button" className={`${styles.sessionModalBtn} ${styles.danger}`} onClick={() => handleTryConfirm('delete')}>Xóa</button>}
          </div>
        </form>
      </div>
      {showConfirmModal && (
        <div className={styles.confirmModalOverlay} onClick={handleConfirmOverlayClick}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>{confirmAction === 'save' ? 'Xác nhận lưu thay đổi?' : 'Xác nhận xóa buổi tập?'}</h3>
            <p>{confirmAction === 'save' ? 'Bạn có chắc chắn muốn lưu các thay đổi này?' : 'Bạn có chắc chắn muốn xóa buổi tập này?'}</p>
            <div className={styles.confirmModalFooter}>
              <button className={`${styles.sessionModalBtn} ${styles.secondary}`} onClick={() => setShowConfirmModal(false)}>Hủy</button>
              <button className={`${styles.sessionModalBtn} ${confirmAction === 'save' ? styles.primary : styles.danger}`} onClick={handleConfirmAction}>
                {confirmAction === 'save' ? 'Xác nhận' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SchedulePage = () => {
  const [sessions, setSessions] = useState(initialSessions);
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [modal, setModal] = useState({ open: false, mode: 'add', session: null });

  const weekDays = getWeekDays(baseDate);
  const todayStr = new Date().toISOString().slice(0, 10);

  // Lấy lịch tập của ngày đang chọn
  const daySessions =
    sessions.find(s => s.date === selectedDate)?.sessions || [];

  // Chuyển tuần
  const handlePrevWeek = () => {
    const prev = new Date(baseDate);
    prev.setDate(prev.getDate() - 7);
    setBaseDate(prev);
    setSelectedDate(getWeekDays(prev)[0].toISOString().slice(0, 10));
  };
  const handleNextWeek = () => {
    const next = new Date(baseDate);
    next.setDate(next.getDate() + 7);
    setBaseDate(next);
    setSelectedDate(getWeekDays(next)[0].toISOString().slice(0, 10));
  };
  const handleToday = () => {
    const today = new Date();
    setBaseDate(today);
    setSelectedDate(today.toISOString().slice(0, 10));
  };

  // Thêm/sửa/xóa buổi tập
  const handleAddSession = (session) => {
    setSessions(prev => {
      const idx = prev.findIndex(s => s.date === session.date);
      const newSession = { ...session, id: Date.now() };
      if (idx === -1) {
        return [...prev, { date: session.date, sessions: [newSession] }];
      } else {
        const updatedSessions = [...prev[idx].sessions, newSession].sort((a, b) => a.startTime.localeCompare(b.startTime));
        return prev.map((s, i) => i === idx ? { ...s, sessions: updatedSessions } : s);
      }
    });
    setModal({ open: false, mode: 'add', session: null });
  };
  const handleEditSession = (session) => {
    setSessions(prev => {
      let newPrev = prev.map(day => {
        if (day.sessions.some(s => s.id === session.id)) {
          return { ...day, sessions: day.sessions.filter(s => s.id !== session.id) };
        }
        return day;
      });
      const idx = newPrev.findIndex(s => s.date === session.date);
      if (idx === -1) {
        newPrev.push({ date: session.date, sessions: [{ ...session }] });
      } else {
        const updatedSessions = [...newPrev[idx].sessions, { ...session }].sort((a, b) => a.startTime.localeCompare(b.startTime));
        newPrev = newPrev.map((s, i) => i === idx ? { ...s, sessions: updatedSessions } : s);
      }
      newPrev = newPrev.filter(day => day.sessions.length > 0);
      return newPrev;
    });
    setModal({ open: false, mode: 'edit', session: null });
  };
  const handleDeleteSession = (session) => {
    setSessions(prev => {
      let newPrev = prev.map(day =>
        day.date === selectedDate
          ? { ...day, sessions: day.sessions.filter(s => s.id !== session.id) }
          : day
      );
      newPrev = newPrev.map(day => ({ ...day, sessions: [...day.sessions].sort((a, b) => a.startTime.localeCompare(b.startTime)) }));
      newPrev = newPrev.filter(day => day.sessions.length > 0);
      return newPrev;
    });
    setModal({ open: false, mode: 'edit', session: null });
  };
  const handleDetailSession = (session) => {
    setModal(prev => {
      if (prev.open && prev.session && prev.session.id === session.id && prev.mode === 'detail') return prev;
      return { open: true, mode: 'detail', session };
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.scheduleContainer}>
          <div className={styles.headerRow}>
            <h1 className={styles.title}>Lịch tập của tôi</h1>
          </div>
          <div className={styles.topBar}>
            <button className={styles.weekBtn} onClick={handlePrevWeek}><FaChevronLeft /></button>
            <div className={styles.weekCalendar}>
              {weekDays.map((d, idx) => {
                const dateStr = d.toISOString().slice(0, 10);
                const isToday = dateStr === todayStr;
                const isSelected = dateStr === selectedDate;
                return (
                  <div
                    key={dateStr}
                    className={
                      styles.dayItem +
                      (isSelected ? ' ' + styles.selected : '') +
                      (isToday ? ' ' + styles.today : '') +
                      (isSelected && isToday ? ' ' + styles.selected + ' ' + styles.today : '')
                    }
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <div>{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][d.getDay()]}</div>
                    <div style={{ fontWeight: 700, fontSize: '1.2em' }}>{d.getDate()}</div>
                  </div>
                );
              })}
            </div>
            <button className={styles.weekBtn} onClick={handleNextWeek}><FaChevronRight /></button>
            <button className={styles.todayBtn} onClick={handleToday}>Hôm nay</button>
            <button className={styles.addSessionBtn} onClick={() => setModal({ open: true, mode: 'add', session: null })}><FaPlus />Thêm buổi tập</button>
          </div>
          <div className={styles.scheduleList}>
            <div className={styles.scheduleTitle}>
              Lịch tập ngày {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
            </div>
            {daySessions.length === 0 ? (
              <div className={styles.noSession}>Không có lịch tập nào cho ngày này.</div>
            ) : (
              daySessions.map((session, idx) => (
                <div key={session.id} className={styles.sessionItem} onClick={e => { if (e.target === e.currentTarget) handleDetailSession(session); }}>
                  <div className={styles.sessionTime}>
                    {session.startTime} - {session.endTime}
                  </div>
                  <div className={styles.sessionGuide}>{session.detail}</div>
                  <div className={styles.sessionActions}>
                    <button className={styles.editBtn} title="Sửa" onClick={e => { e.stopPropagation(); setModal({ open: true, mode: 'edit', session }); }}><FaEdit /></button>
                    <button className={styles.deleteBtn} title="Xóa" onClick={e => { e.stopPropagation(); setModal({ open: true, mode: 'edit', session }); }}><FaTrash /></button>
                  </div>
                </div>
              ))
            )}
          </div>
          <SessionModal
            open={modal.open}
            onClose={() => setModal({ open: false, mode: 'add', session: null })}
            onSave={modal.mode === 'add' ? handleAddSession : handleEditSession}
            onDelete={modal.mode === 'edit' ? handleDeleteSession : undefined}
            mode={modal.mode}
            session={modal.session}
            selectedDate={selectedDate}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SchedulePage;
