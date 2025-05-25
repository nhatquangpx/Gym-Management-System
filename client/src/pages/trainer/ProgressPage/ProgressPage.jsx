import React, { useState } from 'react';
import { Card, Form, Button, message, Input, Modal } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from '../StudentsPage/StudentsPage.module.css';
import dayjs from 'dayjs';
import { FaSearch, FaPhone, FaCalendarAlt, FaDumbbell } from 'react-icons/fa';

const { TextArea } = Input;

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
  },
];

const statusOptions = [
  { value: 'pending', label: 'Chờ phê duyệt' },
  { value: 'active', label: 'Đang hướng dẫn' },
  { value: 'completed', label: 'Đã hoàn thành' },
  { value: 'inactive', label: 'Ngừng theo dõi' }
];

const statusColorClass = {
  pending: styles.statusPending,
  active: styles.statusActive,
  completed: styles.statusCompleted,
  inactive: styles.statusInactive
};

const ProgressPage = () => {
  const [form] = Form.useForm();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sinh dữ liệu đi/vắng cho tháng hiện tại
  const generateMonthlyAttendance = () => {
    const today = dayjs();
    const startOfMonth = today.startOf('month');
    const days = [];
    for (let d = 0; d <= today.date() - 1; d++) {
      const date = startOfMonth.add(d, 'day');
      // Random hóa trạng thái đi/vắng
      const status = Math.random() > 0.25 ? 'attended' : 'missed';
      days.push({
        date: date.format('YYYY-MM-DD'),
        time: '08:00',
        status,
        type: ['Cardio', 'Strength', 'HIIT'][Math.floor(Math.random()*3)]
      });
    }
    return days;
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setAttendanceData(generateMonthlyAttendance());
  };

  const handleSubmitFeedback = async (values) => {
    setLoading(true);
    try {
      setFeedbackHistory(prev => [
        {
          id: Date.now(),
          content: values.feedback,
          date: dayjs().format('YYYY-MM-DD HH:mm'),
        },
        ...prev
      ]);
      message.success('Thêm nhận xét thành công!');
      form.resetFields(['feedback']);
    } catch (error) {
      message.error('Có lỗi xảy ra khi gửi nhận xét');
    }
    setLoading(false);
  };

  // Prepare data for pie chart
  const chartData = [
    { name: 'Đã tập', value: attendanceData.filter(a => a.status === 'attended').length },
    { name: 'Vắng mặt', value: attendanceData.filter(a => a.status === 'missed').length },
  ];

  const COLORS = ['#4CAF50', '#F44336'];

  const handleShowFeedbackDetail = (fb) => {
    setSelectedFeedback(fb);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
  };

  // Lọc và tìm kiếm học viên
  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Đánh giá tiến độ</h1>
      </div>
      {!selectedStudent ? (
        <>
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
                onClick={() => handleSelectStudent(student)}
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
                    <span className={`${styles.status} ${statusColorClass[student.status]}`}>{statusOptions.find(opt => opt.value === student.status)?.label}</span>
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
                    onClick={e => {
                      e.stopPropagation();
                      handleSelectStudent(student);
                    }}
                  >
                    Đánh giá tiến độ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.progressPageContent}>
          <div className={styles.backButtonWrapper}>
            <Button onClick={() => setSelectedStudent(null)} style={{ marginBottom: 16 }}>
              Quay lại danh sách học viên
            </Button>
          </div>
          <Card className={styles.card}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.attendanceList}>
              <h3>Chi tiết buổi tập</h3>
              <div className={styles.attendanceTableWrapper}>
                <table className={styles.attendanceTable}>
                  <thead>
                    <tr>
                      <th>Ngày</th>
                      <th>Giờ</th>
                      <th>Loại buổi tập</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((session, index) => (
                      <tr key={index}>
                        <td>{session.date}</td>
                        <td>{session.time}</td>
                        <td>{session.type}</td>
                        <td>
                          <span className={session.status === 'attended' ? styles.badgeAttended : styles.badgeMissed}>
                            {session.status === 'attended' ? 'Đã tập' : 'Vắng mặt'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <Form form={form} onFinish={handleSubmitFeedback} layout="vertical">
              <Form.Item
                name="feedback"
                label="Nhận xét tiến độ (có thể thêm nhiều lần trong tháng)"
                rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập nhận xét về tiến độ, ví dụ: thái độ, kết quả, lời khuyên..."
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={loading}
                  className={styles.submitButton}
                >
                  Thêm nhận xét
                </Button>
              </Form.Item>
            </Form>

            <div style={{ marginTop: 24 }}>
              <Button onClick={() => setShowHistory(h => !h)}>
                {showHistory ? 'Ẩn lịch sử nhận xét' : 'Xem lịch sử nhận xét'}
              </Button>
              {showHistory && (
                <div style={{ marginTop: 16 }}>
                  <h4>Lịch sử nhận xét</h4>
                  {feedbackHistory.length === 0 ? (
                    <div style={{ color: '#888' }}>Chưa có nhận xét nào</div>
                  ) : (
                    <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                      {feedbackHistory.map(fb => (
                        <li key={fb.id} style={{ marginBottom: 12, background: '#f6f7fb', borderRadius: 8, padding: 12, cursor: 'pointer' }}
                            onClick={() => handleShowFeedbackDetail(fb)}>
                          <div style={{ fontWeight: 500 }}>{fb.content.length > 60 ? fb.content.slice(0, 60) + '...' : fb.content}</div>
                          <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>{fb.date}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <Modal
              open={showModal}
              onCancel={handleCloseModal}
              footer={null}
              title="Chi tiết nhận xét"
            >
              {selectedFeedback && (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>{selectedFeedback.content}</div>
                  <div style={{ color: '#888', fontSize: 13 }}>Thời gian: {selectedFeedback.date}</div>
                </div>
              )}
            </Modal>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ProgressPage; 