import React, { useState, useEffect } from 'react';
import styles from './WorkoutLogPage.module.css';

const today = new Date().toISOString().slice(0, 10);

const WorkoutLogPage = () => {
  const [form, setForm] = useState({
    student: '',
    date: today,
    status: 'present',
    note: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [students, setStudents] = useState([]);

  // Fetch danh sách học viên hôm nay
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8001/api/trainers/today-schedule', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await res.json();
        if (data.success) {
          // Lấy danh sách schedule duy nhất theo id
          const unique = [];
          const seen = new Set();
          data.data.forEach(item => {
            if (!seen.has(item.id)) {
              seen.add(item.id);
              unique.push({ id: item.id, name: item.student });
            }
          });
          setStudents(unique);
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
    if (!form.student) return 'Vui lòng chọn học viên!';
    if (!form.date) return 'Vui lòng chọn ngày!';
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
      // Gửi API ghi nhận buổi tập với id schedule
      const res = await fetch(`http://localhost:8001/api/trainers/log-workout/${form.student}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          comment: form.note
        })
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Đã ghi nhận buổi tập thành công!');
        setError('');
        setForm({ ...form, note: '' });
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
          <label className={styles.label}>Học viên</label>
          <select
            className={styles.input}
            name="student"
            value={form.student}
            onChange={handleChange}
          >
            <option value="">Chọn học viên</option>
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
            disabled
          />
        </div>
        <div className={styles.textarea}>
          <label className={styles.label}>Nhận xét, đánh giá</label>
          <textarea
            className={styles.input}
            name="note"
            value={form.note}
            onChange={handleChange}
            rows={3}
            placeholder="Ví dụ: Đã hoàn thành bài tập, cần chú ý kỹ thuật..."
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <button className={styles.submitBtn} type="submit">Ghi nhận</button>
      </form>
    </div>
  );
};

export default WorkoutLogPage;