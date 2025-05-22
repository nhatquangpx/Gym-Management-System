import React, { useState } from 'react';
import { Card, Row, Col, Button, Select, DatePicker, Table, Tag } from 'antd';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

const { Option } = Select;

const ProgressPage = () => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Mock data - replace with actual API data
  const members = [
    { id: 1, name: 'Nguyễn Văn A' },
    { id: 2, name: 'Trần Thị B' },
    { id: 3, name: 'Lê Văn C' },
  ];

  const weightProgressData = [
    { date: '01/01', weight: 75 },
    { date: '01/02', weight: 74.5 },
    { date: '01/03', weight: 74 },
    { date: '01/04', weight: 73.8 },
    { date: '01/05', weight: 73.5 },
    { date: '01/06', weight: 73 },
  ];

  const performanceData = [
    { subject: 'Sức mạnh', value: 80 },
    { subject: 'Sức bền', value: 65 },
    { subject: 'Tốc độ', value: 70 },
    { subject: 'Linh hoạt', value: 85 },
    { subject: 'Cân bằng', value: 75 },
  ];

  const workoutHistory = [
    {
      key: '1',
      date: '01/01/2024',
      type: 'Cardio',
      duration: '45 phút',
      calories: 350,
      status: 'Hoàn thành',
    },
    {
      key: '2',
      date: '02/01/2024',
      type: 'Strength',
      duration: '60 phút',
      calories: 450,
      status: 'Hoàn thành',
    },
    {
      key: '3',
      date: '03/01/2024',
      type: 'HIIT',
      duration: '30 phút',
      calories: 400,
      status: 'Vắng mặt',
    },
  ];

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Loại bài tập',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'Hoàn thành' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
  ];

  const handleExportReport = () => {
    // Implement export functionality
    console.log('Exporting progress report...');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Đánh giá tiến độ</h1>
        <Button
          type="primary"
          icon={<DownloadOutlined />}
          onClick={handleExportReport}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Xuất báo cáo
        </Button>
      </div>

      <Card className="mb-6">
        <Row gutter={16} align="middle">
          <Col>
            <Select
              placeholder="Chọn hội viên"
              style={{ width: 200 }}
              onChange={(value) => setSelectedMember(value)}
            >
              {members.map(member => (
                <Option key={member.id} value={member.id}>
                  {member.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col>
            <DatePicker.RangePicker 
              onChange={(dates) => setDateRange(dates)}
            />
          </Col>
          <Col>
            <Button 
              type="primary"
              icon={<SearchOutlined />}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Xem tiến độ
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Tiến độ cân nặng">
            <LineChart
              width={500}
              height={300}
              data={weightProgressData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Cân nặng (kg)"
              />
            </LineChart>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Đánh giá hiệu suất">
            <RadarChart
              width={500}
              height={300}
              data={performanceData}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 100]} />
              <Radar
                name="Hiệu suất"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
              <Tooltip />
            </RadarChart>
          </Card>
        </Col>

        <Col xs={24}>
          <Card title="Lịch sử tập luyện">
            <Table
              columns={columns}
              dataSource={workoutHistory}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProgressPage; 