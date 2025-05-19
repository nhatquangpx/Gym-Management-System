import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './WorkoutModal.module.css';
import Button from '../Button/Button'; // Đường dẫn tới component Button của bạn
import InputField from '../InputField/InputField'; // Đường dẫn tới component InputField của bạn

const WorkoutModal = ({ isOpen, onClose, onSave, selectedDate, initialWorkouts, availableExercises }) => {
  const [workouts, setWorkouts] = useState([]);
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  const [currentExerciseDetails, setCurrentExerciseDetails] = useState('');
  const [selectedPredefinedExercise, setSelectedPredefinedExercise] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialWorkouts) {
      setWorkouts([...initialWorkouts]);
    } else {
      setWorkouts([]);
    }
    setCurrentExerciseName('');
    setCurrentExerciseDetails('');
    setSelectedPredefinedExercise('');
  }, [isOpen, initialWorkouts]);


  if (!isOpen) return null;

  const handleAddWorkout = () => {
    let newWorkout = {};
    if (selectedPredefinedExercise) {
      const exercise = availableExercises.find(ex => ex.id === selectedPredefinedExercise);
      if (!exercise) return;
      newWorkout = { 
        id: uuidv4(), 
        name: exercise.name, 
        details: currentExerciseDetails || `Nhóm: ${exercise.group}`,
        type: 'exercise',
        group: exercise.group ? exercise.group.replace(/\s/g, '').toLowerCase() : undefined,
      };
    } else if (currentExerciseName.trim() !== '') {
      newWorkout = { 
        id: uuidv4(), 
        name: currentExerciseName.trim(), 
        details: currentExerciseDetails.trim(), 
        type: 'custom',
        group: undefined,
      };
    } else {
      setError('Vui lòng nhập tên bài tập hoặc chọn bài tập có sẵn!');
      return;
    }
    setWorkouts([...workouts, newWorkout]);
    setCurrentExerciseName('');
    setCurrentExerciseDetails('');
    setSelectedPredefinedExercise('');
    setError('');
  };

  const handleRemoveWorkout = (workoutId) => {
    setWorkouts(workouts.filter(w => w.id !== workoutId));
  };
  
  const handleSaveChanges = () => {
    if (workouts.length === 0) {
      setError('Bạn cần thêm ít nhất một hoạt động!');
      return;
    }
    setError('');
    onSave(selectedDate, workouts);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <h3>Lịch tập cho ngày: {selectedDate.toLocaleDateString('vi-VN')}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <i className="material-icons">close</i>
          </button>
        </header>

        <div className={styles.modalBody}>
          <div className={styles.addWorkoutForm}>
            <h4>Thêm bài tập/hoạt động</h4>
            {error && <div className={styles.errorMsg}>{error}</div>}
            <div className={styles.formRow}>
                <select 
                    value={selectedPredefinedExercise} 
                    onChange={(e) => {
                        setSelectedPredefinedExercise(e.target.value);
                        setCurrentExerciseName('');
                    }}
                    className={styles.selectInput} // Đảm bảo class này được style trong WorkoutModal.module.css
                >
                    <option value="">-- Chọn bài tập có sẵn --</option>
                    {availableExercises.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.name} ({ex.group})</option>
                    ))}
                </select>
            </div>
            <p className={styles.orSeparator}>Hoặc</p>
            <div className={styles.formRow}>
                <InputField // Sử dụng component InputField của bạn
                    id="customExerciseName"
                    label="Tên bài tập/hoạt động tùy chỉnh"
                    type="text"
                    placeholder="VD: Chạy bộ công viên, Tập ngực..."
                    value={currentExerciseName}
                    onChange={(e) => {
                        setCurrentExerciseName(e.target.value);
                        setSelectedPredefinedExercise('');
                    }}
                    disabled={!!selectedPredefinedExercise} // Vô hiệu hóa nếu đã chọn bài tập có sẵn
                />
            </div>
             <div className={styles.formRow}>
                <InputField // Sử dụng component InputField của bạn
                    id="exerciseDetails"
                    label="Chi tiết (VD: 3 hiệp x 10 lần, 30 phút, 5km...)"
                    type="text"
                    placeholder="Mô tả thêm..."
                    value={currentExerciseDetails}
                    onChange={(e) => setCurrentExerciseDetails(e.target.value)}
                />
            </div>
            <Button onClick={handleAddWorkout} className={styles.addButton}> {/* Sử dụng component Button của bạn */}
                <i className="material-icons">add_circle_outline</i> Thêm vào lịch
            </Button>
          </div>

          <div className={styles.workoutList}>
            <h4>Các bài tập/hoạt động đã thêm:</h4>
            {workouts.length === 0 ? (
              <p className={styles.noWorkouts}>Chưa có hoạt động nào cho ngày này.</p>
            ) : (
              <ul>
                {workouts.map(workout => (
                  <li key={workout.id} className={styles.workoutListItem}>
                    <div className={styles.workoutInfo}>
                      <strong>{workout.name}</strong>
                      {workout.details && <small> - {workout.details}</small>}
                    </div>
                    <button onClick={() => handleRemoveWorkout(workout.id)} className={styles.removeButton}>
                      <i className="material-icons">delete_outline</i>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <footer className={styles.modalFooter}>
          <Button onClick={onClose} className={`${styles.actionButton} ${styles.cancelButton}`}> {/* Sử dụng component Button của bạn */}
            Hủy
          </Button>
          <Button onClick={handleSaveChanges} className={`${styles.actionButton} ${styles.saveButton}`}> {/* Sử dụng component Button của bạn */}
            Lưu Thay Đổi
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default WorkoutModal;
