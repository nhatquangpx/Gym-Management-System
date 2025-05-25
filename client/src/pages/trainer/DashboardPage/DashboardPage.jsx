import React, { useEffect, useState } from 'react';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    todaySessions: 0,
    completedSessions: 0,
    upcomingSessions: 0
  });

  const [todaySchedule, setTodaySchedule] = useState([]);
  const [studentProgress, setStudentProgress] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:8001/api/trainers/dashboard-stats', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        // Xử lý lỗi nếu cần
      }
    };

        // Lấy lịch tập hôm nay
    const fetchTodaySchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:8001/api/trainers/today-schedule', {
          headers: {
            'Authorization': 'Bearer ' + token
          }
        });
        const data = await res.json();
        if (data.success) {
          setTodaySchedule(data.data);
        }
      } catch (err) {
        // Xử lý lỗi nếu cần
      }
    };

    // const fetchStudentProgress = async () => { ... }

    fetchStats();
    fetchTodaySchedule();
    // fetchStudentProgress();
  }, []);

  // Nếu chưa có API, giữ mock data cho todaySchedule và studentProgress
  // Khi có API, thay thế dữ liệu dưới đây bằng setTodaySchedule và setStudentProgress

  // const todaySchedule = [
  //   { time: '08:00 - 09:00', student: 'Nguyễn Văn A', type: 'PT Session' },
  //   { time: '09:30 - 10:30', student: 'Trần Thị B', type: 'Group Class' },
  //   { time: '11:00 - 12:00', student: 'Lê Văn C', type: 'PT Session' },
  // ];

  // const studentProgress = [
  //   { name: 'Nguyễn Văn A', progress: 75, goal: 'Giảm cân' },
  //   { name: 'Trần Thị B', progress: 60, goal: 'Tăng cơ' },
  //   { name: 'Lê Văn C', progress: 85, goal: 'Tăng sức mạnh' },
  // ];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Tổng quan</h1>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>Tổng số học viên</h3>
          <p className={styles.statNumber}>{stats.totalStudents}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Buổi tập hôm nay</h3>
          <p className={styles.statNumber}>{stats.todaySessions}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Đã hoàn thành</h3>
          <p className={styles.statNumber}>{stats.completedSessions}</p>
        </div>
        <div className={styles.statCard}>
          <h3>Sắp tới</h3>
          <p className={styles.statNumber}>{stats.upcomingSessions}</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className={styles.section}>
        <h2>Lịch tập hôm nay</h2>
        <div className={styles.scheduleList}>
          {todaySchedule.length === 0 ? (
            <div>Không có lịch tập hôm nay.</div>
          ) : (
            todaySchedule.map((session, index) => (
              <div key={index} className={styles.scheduleItem}>
                <span className={styles.time}>{session.time}</span>
                <span className={styles.student}>{session.student}</span>
                <span className={styles.type}>{session.type}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Student Progress */}
      <div className={styles.section}>
        <h2>Tiến độ học viên</h2>
        <div className={styles.progressList}>
          {studentProgress.length === 0 ? (
            <div>Chưa có dữ liệu tiến độ.</div>
          ) : (
            studentProgress.map((student, index) => (
              <div key={index} className={styles.progressItem}>
                <div className={styles.studentInfo}>
                  <h4>{student.name}</h4>
                  <p>{student.goal}</p>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${student.progress}%` }}
                  />
                  <span className={styles.progressText}>{student.progress}%</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;