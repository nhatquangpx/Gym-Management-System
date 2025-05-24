import React, { useState, useEffect } from 'react';
import { Card, Select, Form, Button, message, DatePicker, Input } from 'antd';
import { UserOutlined, CalendarOutlined, SendOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import styles from './ProgressPage.module.css';

const { Option } = Select;
const { TextArea } = Input;

const ProgressPage = () => {
  const [form] = Form.useForm();
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    setMembers([
      { id: 1, name: 'Nguyễn Văn A' },
      { id: 2, name: 'Trần Thị B' },
      { id: 3, name: 'Lê Văn C' },
    ]);
  }, []);

  // Mock attendance data - replace with actual API call
  const mockAttendanceData = [
    { date: '2024-01-15', time: '08:00', status: 'attended', type: 'Cardio' },
    { date: '2024-01-17', time: '09:00', status: 'missed', type: 'Strength' },
    { date: '2024-01-19', time: '10:00', status: 'attended', type: 'HIIT' },
    { date: '2024-01-20', time: '08:00', status: 'attended', type: 'Cardio' },
  ];

  const handleMemberChange = (value) => {
    setSelectedMember(value);
    // Fetch attendance data for selected member and week
    setAttendanceData(mockAttendanceData);
  };

  const handleWeekChange = (date) => {
    setSelectedWeek(date);
    // Fetch attendance data for selected member and week
    setAttendanceData(mockAttendanceData);
  };

  const handleSubmitFeedback = async (values) => {
    setLoading(true);
    try {
      // Replace with actual API call
      console.log('Submitted feedback:', values);
      message.success('Gửi nhận xét thành công!');
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

  return (
    <div className={styles.progressPage}>
      <Card title="Đánh giá tiến độ" className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitFeedback}
        >
          <Form.Item
            name="memberId"
            label="Chọn học viên"
            rules={[{ required: true, message: 'Vui lòng chọn học viên' }]}
          >
            <Select
              placeholder="Chọn học viên"
              prefix={<UserOutlined />}
              onChange={handleMemberChange}
            >
              {members.map(member => (
                <Option key={member.id} value={member.id}>
                  {member.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="week"
            label="Chọn tuần"
            rules={[{ required: true, message: 'Vui lòng chọn tuần' }]}
          >
            <DatePicker
              picker="week"
              onChange={handleWeekChange}
              style={{ width: '100%' }}
            />
          </Form.Item>

          {selectedMember && selectedWeek && (
            <>
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
                {attendanceData.map((session, index) => (
                  <div
                    key={index}
                    className={`${styles.sessionItem} ${
                      session.status === 'attended' ? styles.attended : styles.missed
                    }`}
                  >
                    <div className={styles.sessionInfo}>
                      <span className={styles.date}>{session.date}</span>
                      <span className={styles.time}>{session.time}</span>
                      <span className={styles.type}>{session.type}</span>
                    </div>
                    <span className={styles.status}>
                      {session.status === 'attended' ? 'Đã tập' : 'Vắng mặt'}
                    </span>
                  </div>
                ))}
              </div>

              <Form.Item
                name="feedback"
                label="Nhận xét tuần"
                rules={[{ required: true, message: 'Vui lòng nhập nhận xét' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="Nhập nhận xét về tiến độ của học viên trong tuần..."
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
                  Gửi nhận xét
                </Button>
              </Form.Item>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
};

export default ProgressPage; 