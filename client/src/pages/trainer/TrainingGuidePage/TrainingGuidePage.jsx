import React, { useState, useEffect } from 'react';
import { Card, Select, Form, Input, Button, message } from 'antd';
import { UserOutlined, SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

const TrainingGuidePage = () => {
  const [form] = Form.useForm();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Mock data - replace with actual API call
  useEffect(() => {
    setMembers([
      { id: 1, name: 'Nguyễn Văn A' },
      { id: 2, name: 'Trần Thị B' },
      { id: 3, name: 'Lê Văn C' },
    ]);
  }, []);

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
        className="max-w-2xl mx-auto"
        style={{ backgroundColor: '#f0f2f5' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="memberId"
            label="Chọn hội viên"
            rules={[{ required: true, message: 'Vui lòng chọn hội viên' }]}
          >
            <Select
              placeholder="Chọn hội viên"
              prefix={<UserOutlined />}
            >
              {members.map(member => (
                <Option key={member.id} value={member.id}>
                  {member.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="feedback"
            label="Hướng dẫn tập luyện"
            rules={[{ required: true, message: 'Vui lòng nhập hướng dẫn' }]}
          >
            <TextArea
              rows={6}
              placeholder="Nhập hướng dẫn tập luyện cho hội viên..."
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