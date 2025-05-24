import React, { useState } from 'react';
import styles from './WorkoutLogPage.module.css';

const mockStudents = [
  'John Doe',
  'Jane Smith',
  'Nguyễn Văn A',
  'Lê Thị B',
  'Trần Văn C',
];

const WorkoutLogPage = () => {
  const [form, setForm] = useState({
    student: '',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleSubmit = e => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      setSuccess('');
      return;
    }
    // Giả lập ghi nhận thành công
    setSuccess('Đã ghi nhận buổi tập thành công!');
    setError('');
    setForm({ ...form, note: '' });
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
            {mockStudents.map(s => <option key={s} value={s}>{s}</option>)}
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
        <div className={styles.textarea}>
          <label className={styles.label}>Ghi chú (tuỳ chọn)</label>
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