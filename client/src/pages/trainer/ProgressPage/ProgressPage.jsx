import React, { useState, useEffect } from 'react';
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
  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [monthOptions, setMonthOptions] = useState([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionModalData, setSessionModalData] = useState(null);

  // Tạo danh sách các tháng từ tháng đầu tiên đến tháng hiện tại
  useEffect(() => {
    // Giả sử lấy tháng đầu tiên là tháng joinDate nhỏ nhất trong mockStudents
    const minJoinDate = mockStudents.reduce((min, s) => s.joinDate < min ? s.joinDate : min, dayjs().format('YYYY-MM-DD'));
    const startMonth = dayjs(minJoinDate).startOf('month');
    const endMonth = dayjs().startOf('month');
    const months = [];
    let m = startMonth.clone();
    while (m.isBefore(endMonth) || m.isSame(endMonth, 'month')) {
      months.push(m.format('YYYY-MM'));
      m = m.add(1, 'month');
    }
    setMonthOptions(months.reverse()); // Gần nhất lên đầu
  }, []);

  // Sinh dữ liệu đi/vắng cho tháng được chọn
  const generateMonthlyAttendance = (monthStr) => {
    const month = dayjs(monthStr);
    const today = dayjs();
    const startOfMonth = month.startOf('month');
    const isCurrentMonth = month.isSame(today, 'month');
    const daysInMonth = isCurrentMonth ? today.date() : month.daysInMonth();

    const trainerComments = {
      attended: [
        'Học viên tập luyện tích cực, hoàn thành tốt các bài tập được giao.',
        'Thể lực tiến bộ rõ rệt, cần duy trì cường độ tập luyện.',
        'Kỹ thuật thực hiện bài tập đã cải thiện nhiều, cần chú ý thêm về nhịp thở.',
        'Tinh thần tập luyện tốt, hoàn thành đầy đủ các bài tập với cường độ cao.',
        'Cần tăng thêm cường độ tập luyện để đạt hiệu quả tốt hơn.',
        'Thực hiện tốt các bài tập cardio, sức bền đã cải thiện đáng kể.',
        'Kỹ thuật squat đã chuẩn hơn, cần duy trì và phát triển thêm.',
        'Tập luyện chăm chỉ, đạt được mục tiêu đề ra cho buổi tập.',
        'Cần chú ý thêm về kỹ thuật deadlift để tránh chấn thương.',
        'Thể lực tốt, hoàn thành xuất sắc các bài tập với cường độ cao.'
      ],
      missed: [
        'Học viên vắng mặt, cần liên hệ để nắm rõ lý do.',
        'Không tham gia buổi tập, đề nghị báo trước khi vắng mặt.',
        'Vắng mặt không lý do, cần trao đổi về lịch tập phù hợp hơn.',
        'Đã thông báo vắng mặt trước, sẽ bù buổi tập vào tuần sau.',
        'Vắng mặt do bận việc đột xuất, cần sắp xếp lại lịch tập.',
        'Không tham gia buổi tập, cần xác nhận lại mục tiêu và cam kết.',
        'Vắng mặt do ốm, đề nghị nghỉ ngơi và hồi phục sức khỏe.',
        'Không tham gia buổi tập, cần trao đổi về động lực tập luyện.',
        'Vắng mặt do công việc, sẽ điều chỉnh lịch tập phù hợp hơn.',
        'Không tham gia buổi tập, cần xác nhận lại cam kết với chương trình.'
      ]
    };

    const days = [];
    for (let d = 0; d < daysInMonth; d++) {
      const date = startOfMonth.add(d, 'day');
      // Random hóa trạng thái đi/vắng
      const status = Math.random() > 0.25 ? 'attended' : 'missed';
      const startTime = '08:00';
      const endTime = '09:00';
      const randomComment = trainerComments[status][Math.floor(Math.random() * trainerComments[status].length)];
      days.push({
        date: date.format('YYYY-MM-DD'),
        time: startTime,
        endTime: endTime,
        status,
        type: ['Cardio', 'Strength', 'HIIT'][Math.floor(Math.random()*3)],
        trainerComment: randomComment
      });
    }
    return days;
  };

  // Khi chọn học viên, reset lại tháng về tháng hiện tại và clear attendanceData
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSelectedMonth(dayjs().format('YYYY-MM'));
    setAttendanceData([]);
  };

  // Khi chọn tháng, generate lại attendanceData
  useEffect(() => {
    if (selectedStudent && selectedMonth) {
      setAttendanceData(generateMonthlyAttendance(selectedMonth));
    }
  }, [selectedStudent, selectedMonth]);

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

  const handleShowSessionDetails = (session) => {
    setSessionModalData(session);
    setShowSessionModal(true);
  };

  const handleCloseSessionModal = () => {
    setShowSessionModal(false);
    setSessionModalData(null);
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
          {/* Bộ lọc tháng */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontWeight: 500, marginRight: 8 }}>Chọn tháng:</label>
            <select
              value={selectedMonth}
              onChange={e => setSelectedMonth(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 6, border: '1.5px solid #1976d2', fontSize: 15 }}
            >
              <option value="" disabled>-- Chọn tháng --</option>
              {monthOptions.map(m => (
                <option key={m} value={m}>{dayjs(m + '-01').format('MM/YYYY')}</option>
              ))}
            </select>
          </div>
          {/* Hiện thông tin khi đã chọn tháng */}
          {selectedMonth && attendanceData.length > 0 && (
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
                        <th>Giờ bắt đầu</th>
                        <th>Giờ kết thúc</th>
                        <th>Trạng thái</th>
                        <th>Xem chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceData.map((session, index) => (
                        <tr key={index}>
                          <td>{session.date}</td>
                          <td>{session.time}</td>
                          <td>{session.endTime || '--:--'}</td>
                          <td>
                            <span className={session.status === 'attended' ? styles.badgeAttended : styles.badgeMissed}>
                              {session.status === 'attended' ? 'Đã tập' : 'Vắng mặt'}
                            </span>
                          </td>
                          <td>
                            <button 
                              className={styles.detailsButton}
                              onClick={() => handleShowSessionDetails(session)}
                            >
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <Form form={form} onFinish={handleSubmitFeedback} layout="vertical" style={{ marginTop: 32 }}>
                <Form.Item
                  name="feedback"
                  label={<span style={{ fontWeight: 700, fontSize: 18, color: '#1976d2' }}>Nhận xét tiến độ (có thể thêm nhiều lần trong tháng)</span>}
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
              <div style={{ marginTop: 32 }}>
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
          )}
        </div>
      )}
      {/* Session Details Custom Modal */}
      <Modal
        open={showSessionModal}
        onCancel={handleCloseSessionModal}
        footer={null}
        centered
        width={540}
        title={<div style={{ fontWeight: 700, fontSize: 20, color: '#1976d2', paddingBottom: 8 }}>Chi tiết buổi tập</div>}
      >
        {sessionModalData && (
          <div style={{
            padding: 0,
            background: '#fff',
            borderRadius: 12,
            minWidth: 320,
            maxWidth: 540,
          }}>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontWeight: 500, color: '#888', minWidth: 90, display: 'inline-block' }}>Ngày:</span>
              <span style={{ fontWeight: 600, color: '#222', marginLeft: 8 }}>{sessionModalData.date}</span>
            </div>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontWeight: 500, color: '#888', minWidth: 90, display: 'inline-block' }}>Thời gian:</span>
              <span style={{ fontWeight: 600, color: '#222', marginLeft: 8 }}>{sessionModalData.time} - {sessionModalData.endTime}</span>
            </div>
            <div style={{ marginBottom: 14 }}>
              <span style={{ fontWeight: 500, color: '#888', minWidth: 90, display: 'inline-block' }}>Trạng thái:</span>
              <span style={{ fontWeight: 600, color: sessionModalData.status === 'attended' ? '#2e7d32' : '#c62828', marginLeft: 8 }}>
                {sessionModalData.status === 'attended' ? 'Đã tập' : 'Vắng mặt'}
              </span>
            </div>
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontWeight: 500, color: '#888', marginBottom: 6 }}>Chi tiết buổi tập:</div>
              <div style={{
                background: '#f5f7fa',
                padding: '13px 15px',
                borderRadius: '6px',
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
                fontSize: 15,
                lineHeight: 1.7,
                color: '#222',
                border: '1px solid #e3f2fd',
                boxShadow: '0 1px 4px rgba(76, 110, 245, 0.04)',
              }}>{sessionModalData.type}</div>
            </div>
            <div>
              <div style={{ fontWeight: 500, color: '#888', marginBottom: 6 }}>Nhận xét của HLV:</div>
              <div style={{
                background: '#f5f7fa',
                padding: '13px 15px',
                borderRadius: '6px',
                whiteSpace: 'pre-line',
                wordBreak: 'break-word',
                fontSize: 15,
                lineHeight: 1.7,
                color: '#222',
                border: '1px solid #e3f2fd',
                boxShadow: '0 1px 4px rgba(76, 110, 245, 0.04)',
              }}>{sessionModalData.trainerComment}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProgressPage; 