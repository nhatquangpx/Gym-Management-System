import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import styles from './SchedulePage.module.css';

// Mock data học viên
const studentsList = [
  'John Doe',
  'Jane Smith',
  'Nguyễn Văn A',
  'Lê Thị B',
  'Trần Văn C',
];

// Mock data cho lịch tập
const initialSessions = [
  {
    date: '2025-05-20',
    sessions: [
      { id: 1, startTime: '08:00', endTime: '09:00', student: 'John Doe', guide: 'Tập ngực, vai, tay' },
      { id: 2, startTime: '09:30', endTime: '10:30', student: 'Jane Smith', guide: 'Yoga cơ bản' },
      { id: 3, startTime: '15:00', endTime: '16:00', student: 'Nguyễn Văn A', guide: 'Cardio + HIIT' },
    ]
  },
  {
    date: '2025-05-21',
    sessions: [
      { id: 4, startTime: '07:00', endTime: '08:00', student: 'Lê Thị B', guide: 'Tập chân, mông' },
      { id: 5, startTime: '10:00', endTime: '11:00', student: 'Trần Văn C', guide: 'Crossfit nâng cao' },
    ]
  },
  {
    date: '2025-05-22',
    sessions: [
      { id: 6, startTime: '08:00', endTime: '09:00', student: 'John Doe', guide: 'Tập lưng, xô' },
      { id: 7, startTime: '16:00', endTime: '17:00', student: 'Jane Smith', guide: 'Yoga nâng cao' },
    ]
  },
  // ... thêm dữ liệu mẫu cho các ngày khác
];

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

const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? '0' : '') + i);
const minutes = Array.from({ length: 12 }, (_, i) => (i * 5 < 10 ? '0' : '') + i * 5);

const SessionModal = ({ open, onClose, onSave, onDelete, mode, session, students, selectedDate }) => {
  const [form, setForm] = React.useState(session || { startTime: '', endTime: '', student: '', guide: '', date: selectedDate });
  const [error, setError] = React.useState('');
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);

  React.useEffect(() => {
    setForm(session ? { ...session, date: session.date || selectedDate } : { startTime: '', endTime: '', student: '', guide: '', date: selectedDate });
    setError(''); // reset error mỗi lần mở
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

  // Đóng modal khi bấm ra ngoài overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Đóng modal xác nhận khi bấm ra ngoài
  const handleConfirmOverlayClick = (e) => {
    if (e.target === e.currentTarget) setShowConfirmModal(false);
  };

  // Validate trước khi mở modal xác nhận
  const handleTryConfirm = (action) => {
    if (action === 'save') {
      if (!form.startTime || !form.endTime || !form.student || !form.guide || !form.date) {
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

  // Helper để lấy giờ và phút từ chuỗi "HH:mm"
  const getHour = (val) => val ? val.split(':')[0] : '';
  const getMinute = (val) => val ? val.split(':')[1] : '';
  // Helper để set lại giờ/phút
  const setTime = (field, hour, minute) => {
    if (hour && minute) {
      setForm(f => ({ ...f, [field]: `${hour}:${minute}` }));
    } else if (hour) {
      setForm(f => ({ ...f, [field]: `${hour}:00` }));
    } else if (minute) {
      setForm(f => ({ ...f, [field]: `00:${minute}` }));
    } else {
      setForm(f => ({ ...f, [field]: '' }));
    }
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
        <form className={styles.sessionModalForm} onSubmit={e => { e.preventDefault(); handleTryConfirm('save'); }}>
          <div className={styles.sessionModalRow}>
            <label className={styles.sessionModalLabel}>Ngày</label>
            <input
              type="date"
              className={styles.sessionModalDateInput}
              value={form.date}
              onChange={handleDateChange}
              disabled={isDetail}
              min={new Date().getFullYear() + '-01-01'}
              max={new Date().getFullYear() + 2 + '-12-31'}
            />
          </div>
          <div className={styles.timeInputs}>
            <div>
              <label className={styles.sessionModalLabel}>Giờ bắt đầu</label>
              <div className={styles.timePickerRow}>
                <select
                  className={styles.timePickerSelect}
                  value={getHour(form.startTime)}
                  onChange={e => setTime('startTime', e.target.value, getMinute(form.startTime))}
                  disabled={isDetail}
                >
                  <option value="">--</option>
                  {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span style={{ margin: '0 4px' }}>:</span>
                <select
                  className={styles.timePickerSelect}
                  value={getMinute(form.startTime)}
                  onChange={e => setTime('startTime', getHour(form.startTime), e.target.value)}
                  disabled={isDetail}
                >
                  <option value="">--</option>
                  {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={styles.sessionModalLabel}>Giờ kết thúc</label>
              <div className={styles.timePickerRow}>
                <select
                  className={styles.timePickerSelect}
                  value={getHour(form.endTime)}
                  onChange={e => setTime('endTime', e.target.value, getMinute(form.endTime))}
                  disabled={isDetail}
                >
                  <option value="">--</option>
                  {hours.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
                <span style={{ margin: '0 4px' }}>:</span>
                <select
                  className={styles.timePickerSelect}
                  value={getMinute(form.endTime)}
                  onChange={e => setTime('endTime', getHour(form.endTime), e.target.value)}
                  disabled={isDetail}
                >
                  <option value="">--</option>
                  {minutes.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.sessionModalRow}>
            <label className={styles.sessionModalLabel}>Học viên</label>
            <select
              className={styles.sessionModalSelect}
              name="student"
              value={form.student}
              onChange={handleChange}
              disabled={isDetail}
            >
              <option value="">Chọn học viên</option>
              {students.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className={styles.sessionModalRow}>
            <label className={styles.sessionModalLabel}>Bài hướng dẫn</label>
            <textarea
              className={styles.sessionModalTextarea + (isEdit ? ' ' + styles.sessionModalTextareaBold : '')}
              name="guide"
              value={form.guide}
              onChange={handleChange}
              disabled={isDetail}
              rows={4}
            />
          </div>
          {isEdit && (
            <div className={styles.currentGuideInfo}>
              Gói tập hiện tại: <span className={styles.currentGuideText}>{form.guide}</span>
            </div>
          )}
          {/* Không hiển thị error khi chỉ xem chi tiết */}
          {!isDetail && error && <div style={{ color: '#d32f2f', fontWeight: 500 }}>{error}</div>}
          <div className={styles.sessionModalFooter}>
            <button type="button" className={`${styles.sessionModalBtn} ${styles.secondary}`} onClick={onClose}>Đóng</button>
            {!isDetail && <button type="submit" className={`${styles.sessionModalBtn} ${styles.primary}`}>{isAdd ? 'Thêm' : 'Lưu'}</button>}
            {/* Ẩn nút Xóa khi là modal sửa */}
            {isEdit && false && onDelete && <button type="button" className={`${styles.sessionModalBtn} ${styles.danger}`} onClick={() => handleTryConfirm('delete')}>Xóa</button>}
          </div>
        </form>
      </div>
      {showConfirmModal && (
        <div className={styles.confirmModalOverlay} onClick={handleConfirmOverlayClick}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>
              {confirmAction === 'save' && isAdd && 'Xác nhận thêm buổi tập?'}
              {confirmAction === 'save' && isEdit && 'Xác nhận lưu thay đổi?'}
              {confirmAction === 'delete' && 'Xác nhận xóa buổi tập?'}
            </h3>
            <p>
              {confirmAction === 'save' && isAdd && 'Bạn có chắc chắn muốn thêm buổi tập này?'}
              {confirmAction === 'save' && isEdit && 'Bạn có chắc chắn muốn lưu các thay đổi này?'}
              {confirmAction === 'delete' && 'Bạn có chắc chắn muốn xóa buổi tập này?'}
            </p>
            <div className={styles.confirmModalFooter}>
              <button className={`${styles.sessionModalBtn} ${styles.secondary}`} onClick={() => setShowConfirmModal(false)}>Hủy</button>
              <button className={`${styles.sessionModalBtn} ${confirmAction === 'save' ? styles.primary : styles.danger}`} onClick={handleConfirmAction}>
                {confirmAction === 'save' && isAdd && 'Thêm'}
                {confirmAction === 'save' && isEdit && 'Lưu'}
                {confirmAction === 'delete' && 'Xóa'}
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
  const [filterStudent, setFilterStudent] = useState('all');
  const [modal, setModal] = useState({ open: false, mode: 'add', session: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, session: null });

  const weekDays = getWeekDays(baseDate);
  const todayStr = new Date().toISOString().slice(0, 10);

  // Lấy lịch tập của ngày đang chọn
  const daySessions =
    sessions.find(s => s.date === selectedDate)?.sessions || [];
  const filteredDaySessions = filterStudent === 'all'
    ? daySessions
    : daySessions.filter(s => s.student === filterStudent);

  // Lấy tất cả học viên có trong tuần này
  const weekStudentSet = new Set();
  weekDays.forEach(d => {
    const dateStr = d.toISOString().slice(0, 10);
    const dayS = sessions.find(s => s.date === dateStr)?.sessions || [];
    dayS.forEach(s => weekStudentSet.add(s.student));
  });
  const weekStudents = Array.from(weekStudentSet);

  // Chuyển tuần
  const handlePrevWeek = () => {
    const prev = new Date(baseDate);
    prev.setDate(prev.getDate() - 7);
    setBaseDate(prev);
    // Chọn ngày đầu tuần mới
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
        // Thêm và sort lại theo time
        const updatedSessions = [...prev[idx].sessions, newSession].sort((a, b) => a.startTime.localeCompare(b.startTime));
        return prev.map((s, i) => i === idx ? { ...s, sessions: updatedSessions } : s);
      }
    });
    setModal({ open: false, mode: 'add', session: null });
  };
  const handleEditSession = (session) => {
    setSessions(prev => {
      // Nếu đổi ngày, xóa khỏi ngày cũ, thêm vào ngày mới
      let found = false;
      let newPrev = prev.map(day => {
        if (day.sessions.some(s => s.id === session.id)) {
          found = true;
          return { ...day, sessions: day.sessions.filter(s => s.id !== session.id) };
        }
        return day;
      });
      // Nếu ngày mới đã có, thêm vào đó và sort
      const idx = newPrev.findIndex(s => s.date === session.date);
      if (idx === -1) {
        newPrev.push({ date: session.date, sessions: [{ ...session }] });
      } else {
        const updatedSessions = [...newPrev[idx].sessions, { ...session }].sort((a, b) => a.startTime.localeCompare(b.startTime));
        newPrev = newPrev.map((s, i) => i === idx ? { ...s, sessions: updatedSessions } : s);
      }
      // Xóa ngày không còn session nào
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
      // Sort lại các session trong ngày (nếu còn)
      newPrev = newPrev.map(day => ({ ...day, sessions: [...day.sessions].sort((a, b) => a.startTime.localeCompare(b.startTime)) }));
      // Xóa ngày không còn session nào
      newPrev = newPrev.filter(day => day.sessions.length > 0);
      return newPrev;
    });
    setModal({ open: false, mode: 'edit', session: null });
  };

  // Xem chi tiết buổi tập
  const handleDetailSession = (session) => {
    setModal(prev => {
      if (prev.open && prev.session && prev.session.id === session.id && prev.mode === 'detail') return prev;
      return { open: true, mode: 'detail', session };
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Lịch tập</h1>
      </div>
      <div className={styles.topBar}>
        <div className={styles.weekCalendarRow}>
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
        </div>
        <div className={styles.rightBar}>
          <button className={styles.todayBtn} onClick={handleToday}>Hôm nay</button>
          <select
            className={styles.filterStudent}
            value={filterStudent}
            onChange={e => setFilterStudent(e.target.value)}
          >
            <option value="all">Tất cả học viên</option>
            {weekStudents.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button className={styles.addSessionBtn} onClick={() => setModal({ open: true, mode: 'add', session: null })}><FaPlus />Thêm buổi tập</button>
        </div>
      </div>
      <div className={styles.scheduleList}>
        <div className={styles.scheduleTitle}>
          Lịch tập ngày {new Date(selectedDate).toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
        </div>
        {filteredDaySessions.length === 0 ? (
          <div className={styles.noSession}>Không có lịch tập nào cho ngày này.</div>
        ) : (
          filteredDaySessions.map((session, idx) => (
            <div key={session.id} className={styles.sessionItem} onClick={e => { if (e.target === e.currentTarget) handleDetailSession(session); }}>
              <div className={styles.sessionTime}>
                {session.startTime} - {session.endTime}
              </div>
              <div className={styles.sessionStudent}>{session.student}</div>
              <div className={styles.sessionGuide}>{session.guide}</div>
              <div className={styles.sessionActions}>
                <button className={styles.editBtn} title="Sửa" onClick={e => { e.stopPropagation(); setModal({ open: true, mode: 'edit', session }); }}><FaEdit /></button>
                <button className={styles.deleteBtn} title="Xóa" onClick={e => { e.stopPropagation(); setDeleteModal({ open: true, session }); }}><FaTrash /></button>
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
        students={studentsList}
        selectedDate={selectedDate}
      />
      {deleteModal.open && (
        <div className={styles.confirmModalOverlay} onClick={e => { if (e.target === e.currentTarget) setDeleteModal({ open: false, session: null }); }}>
          <div className={styles.confirmModal} onClick={e => e.stopPropagation()}>
            <h3>Xác nhận xóa buổi tập?</h3>
            <p>Bạn có chắc chắn muốn xóa buổi tập này?</p>
            <div className={styles.confirmModalFooter}>
              <button className={`${styles.sessionModalBtn} ${styles.secondary}`} onClick={() => setDeleteModal({ open: false, session: null })}>Hủy</button>
              <button className={`${styles.sessionModalBtn} ${styles.danger}`} onClick={() => { handleDeleteSession(deleteModal.session); setDeleteModal({ open: false, session: null }); }}>Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage; 