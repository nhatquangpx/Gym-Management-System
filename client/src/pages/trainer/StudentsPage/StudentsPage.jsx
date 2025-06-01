import React, { useState, useEffect } from 'react';
import { FaSearch, FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaDumbbell, FaTimes, FaChartLine, FaClipboardList, FaChevronDown } from 'react-icons/fa';
import styles from './StudentsPage.module.css';

const statusOptions = [
  { value: 'pending', label: 'Chờ phê duyệt', color: '#ff9800', bg: '#fff7e6', border: '#ffe0b2' },
  { value: 'active', label: 'Đang hướng dẫn', color: '#219653', bg: '#e3fcef', border: '#b7eedc' },
  { value: 'completed', label: 'Đã hoàn thành', color: '#1976d2', bg: '#e3f2fd', border: '#bbdefb' },
];

const statusColorClass = {
  pending: styles.statusPending,
  active: styles.statusActive,
  completed: styles.statusCompleted
};

const StudentModal = ({ student, onClose }) => {
  const [editStatus, setEditStatus] = useState(student.status);
  const modalFooterRef = React.useRef(null);

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
            <p className={styles.infoValue}>{student.goal}</p>
          </div>
        </div>

        <div className={styles.modalFooter} ref={modalFooterRef}>
          <div className={styles.modalFooterButtons}>
            <button className={`${styles.modalButton} ${styles.secondary}`} onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8001/api/trainers/students', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        console.log('Fetched students:', data);
        if (data.success) {
          // Transform API data to match our component's structure
          const formattedStudents = data.data.map(student => ({
            id: student._id,
            name: student.name,
            email: student.email,
            phone: student.phone,
            joinDate: student.membershipStart,
            status: getStatusFromDates(student.membershipEnd),
            avatar: `https://i.pravatar.cc/150?img=1`,
            package: student.packageName,
            lastWorkout: new Date().toISOString(),
            progress: student.progress || 0,
            goal: student.goal,

          }));
          setStudents(formattedStudents);
        } else {
          setError('Không thể tải danh sách học viên');
        }
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Helper function to determine status based on membership end date
  const getStatusFromDates = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    if (end < now) return 'completed';
    return 'active';
  };

  // Xử lý tìm kiếm và lọc
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Đổi trạng thái (chỉ cập nhật khi bấm cập nhật trong modal)
  const handleStatusChange = async (studentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8001/api/trainers/update-student-status/${studentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      if (data.success) {
        setStudents(students.map(student => 
          student.id === studentId ? { ...student, status: newStatus } : student
        ));
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent({ ...selectedStudent, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Error updating student status:', err);
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

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