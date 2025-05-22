import React, { useState, useEffect } from 'react';
import { Card, Select, Form, Input, Button, message, DatePicker, TimePicker } from 'antd';
import { UserOutlined, SendOutlined, CalendarOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const TrainingGuidePage = () => {
  const [form] = Form.useForm();
  const [members, setMembers] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Mock data - replace with actual API call
  useEffect(() => {
    setMembers([
      { id: 1, name: 'Nguyễn Văn A' },
      { id: 2, name: 'Trần Thị B' },
      { id: 3, name: 'Lê Văn C' },
    ]);
  }, []);

  // Mock data cho buổi tập - replace with actual API call
  const mockSessions = [
    { 
      id: 1, 
      date: '2024-01-15', 
      time: '08:00', 
      type: 'Cardio',
      status: 'Chưa thực hiện'
    },
    { 
      id: 2, 
      date: '2024-01-16', 
      time: '09:00', 
      type: 'Strength',
      status: 'Chưa thực hiện'
    },
    { 
      id: 3, 
      date: '2024-01-17', 
      time: '10:00', 
      type: 'HIIT',
      status: 'Chưa thực hiện'
    },
  ];

  const handleMemberChange = (value) => {
    setSelectedMember(value);
    // Fetch sessions for selected member
    setSessions(mockSessions);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Replace with actual API call
      console.log('Submitted values:', values);
      message.success('Gửi hướng dẫn thành công!');
      form.resetFields();
    } catch (error) {
      message.error('Có lỗi xảy ra khi gửi hướng dẫn');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Card 
        title="Hướng dẫn tập luyện" 
        className="max-w-3xl mx-auto"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
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

          {selectedMember && (
            <Form.Item
              name="sessionId"
              label="Chọn buổi tập"
              rules={[{ required: true, message: 'Vui lòng chọn buổi tập' }]}
            >
              <Select
                placeholder="Chọn buổi tập"
                prefix={<CalendarOutlined />}
              >
                {sessions.map(session => (
                  <Option key={session.id} value={session.id}>
                    {`${session.date} - ${session.time} (${session.type}) - ${session.status}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="feedback"
            label="Hướng dẫn tập luyện"
            rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}
          >
            <TextArea
              rows={6}
              placeholder="Nhập hướng dẫn tập luyện cho học viên..."
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Gửi hướng dẫn
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default TrainingGuidePage; 