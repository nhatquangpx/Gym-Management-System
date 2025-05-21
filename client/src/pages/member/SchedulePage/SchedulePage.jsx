import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../../../components/layout/Navbar/Navbar'; // Đường dẫn tới Navbar chung
import Footer from '../../../components/layout/Footer/Footer'; // Đường dẫn tới Footer chung
import WorkoutModal from '../../../components/features/member/WorkoutModal/WorkoutModal'; // Modal sẽ tạo trong components
import styles from './SchedulePage.module.css';
import { useAuth } from '../../../contexts/AuthContext';

// Danh sách bài tập mẫu (trong thực tế có thể lấy từ API hoặc context/constants)
const availableExercises = [
  { id: 'ex1', name: 'Bench Press (Ngực)', group: 'Ngực' },
  { id: 'ex2', name: 'Squat (Chân)', group: 'Chân' },
  { id: 'ex3', name: 'Deadlift (Lưng, Chân)', group: 'Toàn thân' },
  { id: 'ex4', name: 'Overhead Press (Vai)', group: 'Vai' },
  { id: 'ex5', name: 'Pull-up (Lưng, Tay trước)', group: 'Lưng' },
  { id: 'ex6', name: 'Bicep Curl (Tay trước)', group: 'Tay trước' },
  { id: 'ex7', name: 'Tricep Pushdown (Tay sau)', group: 'Tay sau' },
  { id: 'ex8', name: 'Plank (Bụng)', group: 'Bụng' },
  { id: 'ex9', name: 'Treadmill Run (Cardio)', group: 'Cardio' },
  { id: 'ex10', name: 'Leg Press (Chân)', group: 'Chân' },
  { id: 'ex11', name: 'Lat Pulldown (Lưng)', group: 'Lưng' },
  { id: 'ex12', name: 'Dumbbell Shoulder Press (Vai)', group: 'Vai' },
  { id: 'ex13', name: 'Cycling (Cardio)', group: 'Cardio' },
  { id: 'ex14', name: 'Yoga Session', group: 'Linh hoạt' },
  { id: 'ex15', name: 'Rest Day', group: 'Nghỉ ngơi' },
];

const SchedulePage = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  
  const [scheduledWorkouts, setScheduledWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem(`scheduledWorkouts_${user?.id || 'guest'}`);
    return savedWorkouts ? JSON.parse(savedWorkouts) : {};
  });

  useEffect(() => {
    localStorage.setItem(`scheduledWorkouts_${user?.id || 'guest'}`, JSON.stringify(scheduledWorkouts));
  }, [scheduledWorkouts, user]);

  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const daysArray = [];
    // Ngày tháng trước
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, day);
      daysArray.push({
        key: `prev-${day}`,
        day,
        date: prevDate,
        isCurrentMonth: false,
        isPrevMonth: true,
        isNextMonth: false,
      });
    }
    // Ngày tháng này
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      const dayDate = new Date(year, month, i);
      daysArray.push({
        key: dayDate.toISOString().split('T')[0],
        day: i,
        date: dayDate,
        isCurrentMonth: true,
        isPrevMonth: false,
        isNextMonth: false,
        isToday: new Date().toDateString() === dayDate.toDateString(),
      });
    }
    // Ngày tháng sau
    const totalCells = daysArray.length;
    const nextDays = 42 - totalCells; // 6 hàng x 7 cột
    for (let i = 1; i <= nextDays; i++) {
      const nextDate = new Date(year, month + 1, i);
      daysArray.push({
        key: `next-${i}`,
        day: i,
        date: nextDate,
        isCurrentMonth: false,
        isPrevMonth: false,
        isNextMonth: true,
      });
    }
    setDaysInMonth(daysArray);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setTimeout(() => {
      const todayCell = document.querySelector('.' + styles.today);
      if (todayCell) {
        todayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  };

  const handleDayClick = (dayObject) => {
    if (!dayObject) return;
    if (dayObject.isCurrentMonth) {
      setSelectedDate(dayObject.date);
      setIsModalOpen(true);
    } else if (dayObject.isPrevMonth || dayObject.isNextMonth) {
      setCurrentDate(new Date(dayObject.date.getFullYear(), dayObject.date.getMonth(), 1));
      setTimeout(() => {
        // Scroll đến ngày vừa click sau khi chuyển tháng
        const dateString = dayObject.date.toISOString().split('T')[0];
        const dayCell = document.querySelector(`[data-date='${dateString}']`);
        if (dayCell) {
          dayCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  const handleSaveWorkout = (date, workoutsForDay) => {
    const dateString = date.toISOString().split('T')[0];
    setScheduledWorkouts(prev => ({
      ...prev,
      [dateString]: workoutsForDay
    }));
    handleCloseModal();
  };

  const getWorkoutsForDate = (date) => {
    if (!date) return [];
    const dateString = date.toISOString().split('T')[0];
    return scheduledWorkouts[dateString] || [];
  };

  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.scheduleContainer}>
          <header className={styles.calendarHeader}>
            <button onClick={handlePrevMonth} className={styles.navButton}>
              <i className="material-icons">chevron_left</i>
            </button>
            <div className={styles.currentMonthDisplay}>
              <h2>{currentDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' })}</h2>
              <button onClick={handleToday} className={styles.todayButton}>Hôm Nay</button>
            </div>
            <button onClick={handleNextMonth} className={styles.navButton}>
              <i className="material-icons">chevron_right</i>
            </button>
          </header>

          <div className={styles.calendarGrid}>
            {daysOfWeek.map(day => (
              <div key={day} className={`${styles.dayCell} ${styles.dayHeader}`}>
                {day}
              </div>
            ))}
            {daysInMonth.map((dayObj) => (
              <div
                key={dayObj.key}
                className={
                  `${styles.dayCell} ${!dayObj.isCurrentMonth ? styles.otherMonth : ''} ${dayObj.isToday ? styles.today : ''}`
                }
                data-date={dayObj.date.toISOString().split('T')[0]}
                onClick={() => handleDayClick(dayObj)}
              >
                {dayObj.day && <span className={styles.dayNumber}>{dayObj.day}</span>}
                {dayObj.isCurrentMonth && getWorkoutsForDate(dayObj.date).length > 0 && (
                  <div className={styles.workoutsPreview}>
                    {getWorkoutsForDate(dayObj.date).slice(0, 2).map(workout => (
                      <div key={workout.id} className={styles.workoutItemPreview + ' ' + (workout.group ? styles['group_' + workout.group.replace(/\s/g, '').toLowerCase()] : '')}>
                        <i className="material-icons">fitness_center</i> {workout.name}
                      </div>
                    ))}
                    {getWorkoutsForDate(dayObj.date).length > 2 && (
                       <div className={styles.moreWorkouts}>...</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      {isModalOpen && selectedDate && (
        <WorkoutModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveWorkout}
          selectedDate={selectedDate}
          initialWorkouts={getWorkoutsForDate(selectedDate)}
          availableExercises={availableExercises}
        />
      )}
      <Footer />
    </div>
  );
};

export default SchedulePage;
