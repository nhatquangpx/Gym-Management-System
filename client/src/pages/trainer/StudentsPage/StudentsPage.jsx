import React, { useState } from 'react';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaDumbbell, FaTimes, FaChartLine, FaClipboardList, FaChevronDown } from 'react-icons/fa';
import styles from './StudentsPage.module.css';

// Mock data - sẽ thay thế bằng API call thực tế
const mockStudents = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+84 123 456 789',
    joinDate: '2024-01-15',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=1',
    package: 'Premium Fitness',
    lastWorkout: '2024-03-15',
    progress: 75,
    goals: ['Giảm cân', 'Tăng cơ'],
    notes: 'Học viên chăm chỉ, tiến bộ tốt',
    nextSession: '2024-03-20 15:00'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+84 987 654 321',
    joinDate: '2024-02-01',
    status: 'pending',
    avatar: 'https://i.pravatar.cc/150?img=2',
    package: 'Basic Training',
    lastWorkout: '2024-03-14',
    progress: 30,
    goals: ['Tăng sức bền'],
    notes: 'Cần tập trung vào cardio',
    nextSession: '2024-03-21 16:00'
  },
  {
    id: 3,
    name: 'Nguyễn Văn A',
    email: 'vana@example.com',
    phone: '+84 111 222 333',
    joinDate: '2024-03-01',
    status: 'completed',
    avatar: 'https://i.pravatar.cc/150?img=3',
    package: 'Yoga',
    lastWorkout: '2024-03-18',
    progress: 100,
    goals: ['Dẻo dai', 'Thư giãn'],
    notes: 'Đã hoàn thành mục tiêu',
    nextSession: '2024-03-25 10:00'
  },
  {
    id: 4,
    name: 'Lê Thị B',
    email: 'leb@example.com',
    phone: '+84 444 555 666',
    joinDate: '2024-01-20',
    status: 'inactive',
    avatar: 'https://i.pravatar.cc/150?img=4',
    package: 'Cardio',
    lastWorkout: '2024-02-28',
    progress: 10,
    goals: ['Giảm cân'],
    notes: 'Cần động viên thêm',
    nextSession: '2024-03-30 09:00'
  },
  {
    id: 5,
    name: 'Trần Văn C',
    email: 'tranc@example.com',
    phone: '+84 777 888 999',
    joinDate: '2024-02-10',
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=5',
    package: 'Crossfit',
    lastWorkout: '2024-03-19',
    progress: 60,
    goals: ['Tăng sức mạnh'],
    notes: 'Tiến bộ tốt',
    nextSession: '2024-03-22 17:00'
  }
];

const statusOptions = [
  { value: 'pending', label: 'Chờ phê duyệt', color: '#ff9800', bg: '#fff7e6', border: '#ffe0b2' },
  { value: 'active', label: 'Đang hướng dẫn', color: '#219653', bg: '#e3fcef', border: '#b7eedc' },
  { value: 'completed', label: 'Đã hoàn thành', color: '#1976d2', bg: '#e3f2fd', border: '#bbdefb' },
  { value: 'inactive', label: 'Ngừng theo dõi', color: '#d84315', bg: '#fbe9e7', border: '#ffccbc' }
];

const statusColorClass = {
  pending: styles.statusPending,
  active: styles.statusActive,
  completed: styles.statusCompleted,
  inactive: styles.statusInactive
};

const StudentModal = ({ student, onClose, onStatusChange }) => {
  const [editStatus, setEditStatus] = useState(student.status);
  const [showSuccess, setShowSuccess] = useState(false);
  const modalFooterRef = React.useRef(null);

  const handleUpdate = () => {
    onStatusChange(student.id, editStatus);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    setTimeout(() => {
      if (modalFooterRef.current) {
        modalFooterRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 100); // scroll sau khi render thông báo
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Thông tin học viên</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.modalSection}>
            <div className={styles.studentHeader}>
              <img
                src={student.avatar}
                alt={student.name}
                className={styles.avatar}
              />
              <div className={styles.studentInfo}>
                <h3 className={styles.name}>{student.name}</h3>
                <p className={styles.email}>{student.email}</p>
                <div className={styles.statusSelectWrapper}>
                  <select
                    className={styles.statusSelect}
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value)}
                    style={{
                      color: statusOptions.find(opt => opt.value === editStatus)?.color,
                      background: statusOptions.find(opt => opt.value === editStatus)?.bg,
                      borderColor: statusOptions.find(opt => opt.value === editStatus)?.border
                    }}
                  >
                    {statusOptions.map(option => (
                      <option
                        key={option.value}
                        value={option.value}
                        style={{
                          color: option.color,
                          background: option.bg
                        }}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <span className={styles.statusSelectArrow}>
                    <FaChevronDown />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Thông tin cơ bản</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Số điện thoại</span>
                <span className={styles.infoValue}>{student.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Ngày tham gia</span>
                <span className={styles.infoValue}>
                  {new Date(student.joinDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Gói tập</span>
                <span className={styles.infoValue}>{student.package}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Buổi tập cuối</span>
                <span className={styles.infoValue}>
                  {new Date(student.lastWorkout).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Tiến độ</h3>
            <div className={styles.progressSection}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Hoàn thành mục tiêu</span>
                <span className={styles.infoValue}>{student.progress}%</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${student.progress}%` }}
                />
              </div>
            </div>
          </div>

          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Mục tiêu</h3>
            <ul className={styles.goalsList}>
              {student.goals.map((goal, index) => (
                <li key={index} className={styles.goalItem}>
                  {goal}
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Ghi chú</h3>
            <p className={styles.notes}>{student.notes}</p>
          </div>

          <div className={styles.modalSection}>
            <h3 className={styles.sectionTitle}>Buổi tập tiếp theo</h3>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Thời gian</span>
              <span className={styles.infoValue}>
                {new Date(student.nextSession).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter} ref={modalFooterRef}>
          {showSuccess && <div className={styles.successMsgCenter}>Cập nhật thành công!</div>}
          <div className={styles.modalFooterButtons}>
            <button className={`${styles.modalButton} ${styles.secondary}`} onClick={onClose}>Đóng</button>
            <button
              className={`${styles.modalButton} ${styles.primary}`}
              onClick={handleUpdate}
              disabled={editStatus === student.status}
            >
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsPage = () => {
  const [students, setStudents] = useState(mockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Xử lý tìm kiếm và lọc
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Đổi trạng thái (chỉ cập nhật khi bấm cập nhật trong modal)
  const handleStatusChange = (studentId, newStatus) => {
    setStudents(students.map(student => student.id === studentId ? { ...student, status: newStatus } : student));
    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent({ ...selectedStudent, status: newStatus });
    }
  };

  // Render trạng thái với màu sắc
  const renderStatus = (status) => {
    const config = statusOptions.find(opt => opt.value === status);
    return (
      <span
        className={styles.status}
        style={{
          color: config?.color,
          background: config?.bg,
          border: `1px solid ${config?.border}`
        }}
      >
        {config ? config.label : status}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Quản lý học viên</h1>
      </div>

      <div className={styles.searchFilter}>
        <div className={styles.searchBox}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className={styles.filterSelect}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.studentsGrid}>
        {filteredStudents.map(student => (
          <div
            key={student.id}
            className={styles.studentCard}
            onClick={() => setSelectedStudent(student)}
          >
            <div className={styles.studentHeader}>
              <img
                src={student.avatar}
                alt={student.name}
                className={styles.avatar}
              />
              <div className={styles.studentInfo}>
                <h3 className={styles.name}>{student.name}</h3>
                <p className={styles.email}>{student.email}</p>
                {renderStatus(student.status)}
              </div>
            </div>

            <div className={styles.studentDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaPhone /> Số điện thoại
                </span>
                <span className={styles.detailValue}>{student.phone}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaCalendarAlt /> Ngày tham gia
                </span>
                <span className={styles.detailValue}>
                  {new Date(student.joinDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>
                  <FaDumbbell /> Gói tập
                </span>
                <span className={styles.detailValue}>{student.package}</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button
                className={`${styles.actionButton} ${styles.primary}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStudent(student);
                }}
              >
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default StudentsPage; 