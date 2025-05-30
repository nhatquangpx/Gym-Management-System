import React, { useState, useEffect } from 'react';
import styles from '../trainer/WorkoutLogPage/WorkoutLogPage.module.css';

const today = new Date().toISOString().slice(0, 10);

const StaffWorkoutLogPage = () => {
  const [form, setForm] = useState({
    student: '',
    date: today,
    startTime: '',
    status: 'present',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [students, setStudents] = useState([]);

  // Fetch danh sách học viên hôm nay
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        // TODO: Đổi API phù hợp cho staff nếu cần
        const res = await fetch('/api/members', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setStudents(data.map(m => ({ id: m._id, name: m.name })));
        } else if (Array.isArray(data.data)) {
          setStudents(data.data.map(m => ({ id: m._id, name: m.name })));
        } else {
          setStudents([]);
        }
      } catch (err) {
        setStudents([]);
      }
    };
    fetchStudents();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const validate = () => {
    if (!form.student) return 'Vui lòng chọn hội viên!';
    if (!form.date) return 'Vui lòng chọn ngày!';
    if (!form.startTime) return 'Vui lòng nhập giờ bắt đầu!';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setSuccess('');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      // TODO: Đổi API phù hợp cho staff nếu cần
      const res = await fetch('/api/staff/log-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          memberId: form.student,
          date: form.date,
          startTime: form.startTime,
          status: form.status === 'present' ? 'Đã tập' : 'Vắng mặt',
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Đã ghi nhận buổi tập thành công!');
        setError('');
        setForm({ ...form, startTime: '' });
      } else {
        setError(data.message || 'Ghi nhận thất bại!');
        setSuccess('');
      }
    } catch (err) {
      setError('Lỗi khi ghi nhận buổi tập!');
      setSuccess('');
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Ghi nhận buổi tập</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div>
          <label className={styles.label}>Hội viên</label>
          <select
            className={styles.input}
            name="student"
            value={form.student}
            onChange={handleChange}
          >
            <option value="">Chọn hội viên</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={styles.label}>Ngày</label>
          <input
            className={styles.input}
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className={styles.label}>Giờ bắt đầu</label>
          <input
            className={styles.input}
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className={styles.label}>Trạng thái</label>
          <select
            className={styles.statusSelect}
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="present">Đã tập</option>
            <option value="absent">Vắng mặt</option>
          </select>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <button className={styles.submitBtn} type="submit">Ghi nhận</button>
      </form>
    </div>
  );
};

export default StaffWorkoutLogPage; 