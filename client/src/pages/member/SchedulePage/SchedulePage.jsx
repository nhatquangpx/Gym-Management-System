import React, { useEffect, useState } from 'react';
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

const hours = Array.from({ length: 24 }, (_, i) => (i < 10 ? '0' : '') + i);
const minutes = Array.from({ length: 12 }, (_, i) => (i * 5 < 10 ? '0' : '') + i * 5);

const SessionModal = ({ open, onClose, onSave, onDelete, mode, session, selectedDate }) => {
  const [form, setForm] = React.useState(session || { startTime: '', endTime: '', detail: '', trainerComment: '', date: selectedDate });
  const [error, setError] = React.useState('');
  const [showConfirmModal, setShowConfirmModal] = React.useState(false);
  const [confirmAction, setConfirmAction] = React.useState(null);
  const dateInputRef = React.useRef();

  useEffect(() => {
    setForm(session ? { ...session, date: session.date || selectedDate } : { startTime: '', endTime: '', detail: '', trainerComment: '', date: selectedDate });
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
                disabled={isDetail || isEdit}
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
        {isEdit && (
          <div className={styles.dateChangeNote}>
            Không thể thay đổi ngày khi sửa buổi tập. Nếu muốn đổi ngày, vui lòng xóa buổi tập này và tạo buổi tập mới.
          </div>
        )}
        <form className={styles.sessionModalForm} onSubmit={e => { e.preventDefault(); handleTryConfirm('save'); }}>
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
          <label className={styles.sessionModalLabel}>Chi tiết buổi tập</label>
          <textarea
            className={styles.sessionModalTextarea + (isEdit ? ' ' + styles.sessionModalTextareaBold : '')}
            name="detail"
            value={form.detail}
            onChange={handleChange}
            disabled={isDetail}
            rows={3}
          />
          {isDetail && session.comment && (
            <>
              <label className={styles.sessionModalLabel}>Nhận xét của huấn luyện viên</label>
              <textarea
                className={styles.sessionModalTextarea}
                name="trainerComment"
                value={session.comment}
                disabled={true}
                rows={3}
              />
            </>
          )}
          <div className={styles.checkTimes}>
            <div className={styles.checkTimeItem}>
              <div className={styles.checkTimeLabel}>Thời gian checkin:</div>
              <div className={styles.checkTimeValue}>
                {session?.checkinTime ? session.checkinTime : 'Chưa checkin'}
              </div>
            </div>
            <div className={styles.checkTimeItem}>
              <div className={styles.checkTimeLabel}>Thời gian checkout:</div>
              <div className={styles.checkTimeValue}>
                {session?.checkoutTime ? session.checkoutTime : 'Chưa checkout'}
              </div>
            </div>
          </div>
          {/* Không hiển thị error khi chỉ xem chi tiết */}
          {!isDetail && error && <div style={{ color: '#ff1744', fontWeight: 500 }}>{error}</div>}
          <div className={styles.sessionModalFooter}>
            <button type="button" className={`${styles.sessionModalBtn} ${styles.secondary}`} onClick={onClose}>Đóng</button>
            {!isDetail && <button type="submit" className={`${styles.sessionModalBtn} ${styles.primary}`}>{isAdd ? 'Thêm' : 'Lưu'}</button>}
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
  const [sessions, setSessions] = useState([]);

  // Hàm nhóm lịch tập theo ngày
  const groupSchedulesByDate = (schedules) => {
    const map = {};
    schedules.forEach(s => {
      const date = new Date(s.date).toISOString().slice(0, 10);
      if (!map[date]) map[date] = [];
      map[date].push({
        id: s._id,
        startTime: s.timeStart,
        endTime: s.timeEnd,
        detail: s.exercises,
        trainerComment: s.trainerComment || '',
        checkinTime: s.checkinTime,
        checkoutTime: s.checkoutTime,
        status: s.status || 'Chưa tập',
        comment: s.comment || '',
      });
    });
    return Object.entries(map).map(([date, sessions]) => ({
      date,
      sessions
    }));
  };

  useEffect(() => {
    const fetchMemberSchedules = async (memberId) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8001/api/members/get-schedules/${memberId}`, {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await res.json();
        console.log('Fetched schedules:', data);
        if (data.success) {
          const grouped = groupSchedulesByDate(data.data);
          setSessions(grouped);
        } else {
          setSessions([]);
        }
      } catch (err) {
        setSessions([]);
      }
    };
    const memberId = JSON.parse(localStorage.getItem('user'))?._id || JSON.parse(localStorage.getItem('user'))?.id;
    if (memberId) {
      fetchMemberSchedules(memberId);
    } 
  }, []);
  console.log('Sessions:', sessions);
  const [baseDate, setBaseDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [modal, setModal] = useState({ open: false, mode: 'add', session: null });
  const [deleteModal, setDeleteModal] = useState({ open: false, session: null });

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
  const handleAddSession = async (session) => {
    try {
      const token = localStorage.getItem('token');
      // Gửi API thêm buổi tập
      const res = await fetch('http://localhost:8001/api/members/add-schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          date: session.date,
          timeStart: session.startTime,
          timeEnd: session.endTime,
          exercises: session.detail,
          comment: session.comment || '',
          status: session.status || 'Chưa tập'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSessions(prev => {
          const idx = prev.findIndex(s => s.date === session.date);
          const newSession = {
            ...session,
            id: data.data._id,
          };
          if (idx === -1) {
            return [...prev, { date: session.date, sessions: [newSession] }];
          } else {
            const updatedSessions = [...prev[idx].sessions, newSession].sort((a, b) => a.startTime.localeCompare(b.startTime));
            return prev.map((s, i) => i === idx ? { ...s, sessions: updatedSessions } : s);
          }
        });
        setModal({ open: false, mode: 'add', session: null });
      } else {
        alert(data.message || 'Thêm buổi tập thất bại!');
      }
    } catch (err) {
      alert('Lỗi khi thêm buổi tập!');
    }
  };
  const handleEditSession = async (session) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8001/api/members/update-schedule/${session.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          workoutType: session.workoutType,
          date: session.date,
          timeStart: session.startTime,
          timeEnd: session.endTime,
          exercises: session.detail,
          comment: session.comment || '',
          status: session.status || 'Chưa tập'
        })
      });
      const data = await res.json();
      if (data.success) {
        // Cập nhật lại state nếu cần
        setSessions(prev => {
          const dayIdx = prev.findIndex(d => d.date === session.date);
          if (dayIdx === -1) return prev;
          const updatedSessions = prev[dayIdx].sessions.map(s =>
            s.id === session.id ? { ...session } : s
          ).sort((a, b) => a.startTime.localeCompare(b.startTime));
          return prev.map((d, i) =>
            i === dayIdx ? { ...d, sessions: updatedSessions } : d
          );
        });
        setModal({ open: false, mode: 'edit', session: null });
      } else {
        alert(data.message || 'Cập nhật buổi tập thất bại!');
      }
    } catch (err) {
      alert('Lỗi khi cập nhật buổi tập!');
    }
  };
  const handleDeleteSession = async (session) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8001/api/members/delete-schedule/${session.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer ' + token
        }
      });
      const data = await res.json();
      if (data.success) {
        setSessions(prev => {
          let newPrev = prev.map(day =>
            day.date === session.date
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
      } else {
        alert(data.message || 'Xóa buổi tập thất bại!');
      }
    } catch (err) {
      alert('Lỗi khi xóa buổi tập!');
    }
  };
  const handleDetailSession = (session) => {
    if (modal.open && modal.session && modal.session.id === session.id && modal.mode === 'detail') return;
    setModal({ open: true, mode: 'detail', session });
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
                const hasSessions = sessions.some(s => s.date === dateStr);
                return (
                  <div
                    key={dateStr}
                className={
                      styles.dayItem +
                      (isSelected ? ' ' + styles.selected : '') +
                      (isToday ? ' ' + styles.today : '') +
                      (isSelected && isToday ? ' ' + styles.selected + ' ' + styles.today : '') +
                      (hasSessions ? ' ' + styles.hasSessions : '')
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
      </main>
      <Footer />
    </div>
  );
};

export default SchedulePage;
