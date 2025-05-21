import React from 'react';
import styles from './DashboardPage.module.css';

const DashboardPage = () => {
  // Mock data - sẽ được thay thế bằng data thật từ API
  const stats = {
    totalStudents: 25,
    todaySessions: 8,
    completedSessions: 5,
    upcomingSessions: 3
  };

  const todaySchedule = [
    { time: '08:00', student: 'Nguyễn Văn A', type: 'PT Session' },
    { time: '09:30', student: 'Trần Thị B', type: 'Group Class' },
    { time: '11:00', student: 'Lê Văn C', type: 'PT Session' },
  ];

  const studentProgress = [
    { name: 'Nguyễn Văn A', progress: 75, goal: 'Giảm cân' },
    { name: 'Trần Thị B', progress: 60, goal: 'Tăng cơ' },
    { name: 'Lê Văn C', progress: 85, goal: 'Tăng sức mạnh' },
  ];

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
          {todaySchedule.map((session, index) => (
            <div key={index} className={styles.scheduleItem}>
              <span className={styles.time}>{session.time}</span>
              <span className={styles.student}>{session.student}</span>
              <span className={styles.type}>{session.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Student Progress */}
      <div className={styles.section}>
        <h2>Tiến độ học viên</h2>
        <div className={styles.progressList}>
          {studentProgress.map((student, index) => (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 