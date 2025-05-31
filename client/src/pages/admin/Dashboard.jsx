import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  CircularProgress,
  Select,
  MenuItem
} from '@mui/material';
import {
  People,
  FitnessCenter,
  ShoppingCart,
  AttachMoney,
  MoreVert,
  Build,
  Feedback as FeedbackIcon,
  MeetingRoom
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    members: 0,
    packages: 0,
    equipments: 0,
    gymrooms: 0,
    feedbacks: 0,
    orders: 0,
    revenueMonth: 0,
    newOrders: 0,
    loading: true
  });
  const [recent, setRecent] = useState([]);
  const [revenueChart, setRevenueChart] = useState([]);
  const [activityType, setActivityType] = useState('all');
  const [revenueFilter, setRevenueFilter] = useState('day');

  useEffect(() => {
    async function fetchStats() {
      setStats(s => ({ ...s, loading: true }));
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      try {
        const [
          membersRes,
          packagesRes,
          equipmentsRes,
          gymroomsRes,
          feedbacksRes,
          ordersRes,
          employeesRes,
          trainersRes
        ] = await Promise.all([
          fetch('/api/members', { headers }),
          fetch('/api/packages', { headers }),
          fetch('/api/equipments', { headers }),
          fetch('/api/gymrooms', { headers }),
          fetch('/api/feedbacks', { headers }),
          fetch('/api/orders', { headers }),
          fetch('/api/employees', { headers }),
          fetch('/api/trainers', { headers })
        ]);
        const [
          members,
          packages,
          equipments,
          gymrooms,
          feedbacks,
          ordersData,
          employees,
          trainers
        ] = await Promise.all([
          membersRes.json(),
          packagesRes.json(),
          equipmentsRes.json(),
          gymroomsRes.json(),
          feedbacksRes.json(),
          ordersRes.json(),
          employeesRes.json(),
          trainersRes.json()
        ]);
        const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
        // Đơn hàng paid
        const paidOrders = orders.filter(o => o.status === 'paid');
        // Đơn hàng paid trong tháng hiện tại
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const paidOrdersThisMonth = paidOrders.filter(o => {
          const d = new Date(o.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        });
        const revenueMonth = paidOrdersThisMonth.reduce((sum, o) => sum + (o.amount || 0), 0);
        // Đơn hàng mới (paid trong tuần hiện tại)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Chủ nhật
        startOfWeek.setHours(0,0,0,0);
        const newOrders = paidOrders.filter(o => {
          const d = new Date(o.createdAt);
          return d >= startOfWeek && d <= now;
        }).length;
        const membersArr = Array.isArray(members) ? members : (members.data || members.members || []);
        const feedbacksArr = Array.isArray(feedbacks) ? feedbacks : (feedbacks.data || feedbacks.feedbacks || []);
        // Recent activities (CRUD for all types)
        const recentList = [];
        const pushCrudLog = (arr, type, getName) => {
          (Array.isArray(arr) ? arr : (arr.data || arr)).forEach(item => {
            if (item.createdAt) {
              recentList.push({
                type,
                time: item.createdAt,
                text: `${getName(item)} vừa được thêm mới`
              });
            }
            if (item.updatedAt && item.updatedAt !== item.createdAt) {
              recentList.push({
                type,
                time: item.updatedAt,
                text: `${getName(item)} vừa được cập nhật`
              });
            }
            if (item.deletedAt) {
              recentList.push({
                type,
                time: item.deletedAt,
                text: `${getName(item)} vừa bị xóa`
              });
            }
          });
        };
        // Đơn hàng (chỉ log thêm mới, vì không sửa/xóa)
        paidOrders.forEach(o => {
          if (o.createdAt) {
            recentList.push({
              type: 'order',
              time: o.createdAt,
              text: `Hội viên ${o.userId?.name || 'N/A'} vừa đăng ký gói ${o.packageId?.name || 'N/A'}`
            });
          }
        });
        pushCrudLog(equipments, 'equipment', eq => `Thiết bị ${eq.name}`);
        pushCrudLog(feedbacksArr, 'feedback', fb => `Feedback của hội viên ${fb.memberName || 'N/A'}`);
        pushCrudLog(packages, 'package', pkg => `Gói tập ${pkg.name}`);
        pushCrudLog(employees, 'employee', emp => `Nhân viên ${emp.name}`);
        pushCrudLog(trainers, 'trainer', tr => `Trainer ${tr.name}`);
        // Sắp xếp và lấy 10 hoạt động mới nhất
        recentList.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecent(recentList.slice(0, 10));
        // Revenue chart (theo filter)
        setStats({
          members: membersArr.length,
          packages: Array.isArray(packages) ? packages.length : 0,
          equipments: Array.isArray(equipments) ? equipments.length : 0,
          gymrooms: Array.isArray(gymrooms) ? gymrooms.length : 0,
          feedbacks: feedbacksArr.length,
          orders: orders.length,
          revenueMonth,
          newOrders,
          loading: false
        });
        // Tính revenueChart theo filter
        setRevenueChart(getRevenueChartData(paidOrders, revenueFilter));
      } catch (err) {
        setStats(s => ({ ...s, loading: false }));
      }
    }
    fetchStats();
    // eslint-disable-next-line
  }, []);

  // Cập nhật revenueChart khi đổi filter
  useEffect(() => {
    async function updateRevenueChart() {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      const ordersRes = await fetch('/api/orders', { headers });
      const ordersData = await ordersRes.json();
      const orders = Array.isArray(ordersData) ? ordersData : (ordersData.data || []);
      const paidOrders = orders.filter(o => o.status === 'paid');
      setRevenueChart(getRevenueChartData(paidOrders, revenueFilter));
    }
    updateRevenueChart();
  }, [revenueFilter]);

  // Hàm tổng hợp dữ liệu doanh thu theo filter
  function getRevenueChartData(orders, filter) {
    const now = new Date();
    const chartData = [];
    if (filter === 'day') {
      // Theo ngày trong tháng hiện tại
      const thisMonth = now.getMonth();
      const thisYear = now.getFullYear();
      const daysInMonth = new Date(thisYear, thisMonth + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const total = orders.filter(o => {
          const d = new Date(o.createdAt);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear && d.getDate() === day;
        }).reduce((sum, o) => sum + (o.amount || 0), 0);
        chartData.push({ date: day, revenue: total });
      }
    } else if (filter === 'month') {
      // Theo từng tháng trong năm hiện tại
      const thisYear = now.getFullYear();
      for (let m = 0; m < 12; m++) {
        const total = orders.filter(o => {
          const d = new Date(o.createdAt);
          return d.getFullYear() === thisYear && d.getMonth() === m;
        }).reduce((sum, o) => sum + (o.amount || 0), 0);
        chartData.push({ date: `Th${m+1}`, revenue: total });
      }
    } else if (filter === 'year') {
      // Theo từng năm (5 năm liên tiếp quanh năm hiện tại)
      const thisYear = now.getFullYear();
      for (let y = thisYear - 2; y <= thisYear + 2; y++) {
        const total = orders.filter(o => {
          const d = new Date(o.createdAt);
          return d.getFullYear() === y;
        }).reduce((sum, o) => sum + (o.amount || 0), 0);
        chartData.push({ date: `${y}`, revenue: total });
      }
    }
    return chartData;
  }

  if (stats.loading) {
    return <Box sx={{ p: 3, background: 'var(--admin-bg)', minHeight: '100vh' }}><CircularProgress /></Box>;
  }

  const statCards = [
    {
      title: 'Tổng thành viên',
      value: stats.members,
      icon: <People sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, trend: '', color: 'var(--admin-primary)'
    },
    {
      title: 'Gói tập',
      value: stats.packages,
      icon: <FitnessCenter sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, trend: '', color: 'var(--admin-primary)'
    },
    {
      title: 'Thiết bị',
      value: stats.equipments,
      icon: <Build sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, trend: '', color: 'var(--admin-primary)'
    },
    {
      title: 'Phòng tập',
      value: stats.gymrooms,
      icon: <MeetingRoom sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, trend: '', color: 'var(--admin-primary)'
    },
    {
      title: 'Phản hồi',
      value: stats.feedbacks,
      icon: <FeedbackIcon sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, trend: '', color: 'var(--admin-primary)'
    },
    {
      title: 'Đơn hàng mới (tuần)',
      value: stats.newOrders,
      icon: <ShoppingCart sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, trend: '', color: 'var(--admin-primary)'
    },
    {
      title: 'Tổng đơn hàng',
      value: stats.orders,
      icon: <ShoppingCart sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, trend: '', color: 'var(--admin-primary)'
    },
    {
      title: 'Doanh thu tháng',
      value: stats.revenueMonth.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      icon: <AttachMoney sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, trend: '', color: 'var(--admin-primary)'
    },
  ];

  // Lọc hoạt động
  const filteredRecent = activityType === 'all'
    ? recent
    : recent.filter(item => item.type === activityType);

  return (
    <Box sx={{ p: 3, background: 'var(--admin-bg)', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', mb: 4 }}>
        Tổng quan
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
            <Card sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderLeft: `4px solid ${stat.color}`, width: '100%', minWidth: 0 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" color="var(--admin-text)" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: 'var(--admin-text)', fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
            <CardHeader
              title={<span style={{ color: 'var(--admin-text)', fontWeight: 600 }}>Hoạt động gần đây</span>}
              action={
                <Select
                  value={activityType}
                  onChange={e => setActivityType(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120, color: 'var(--admin-primary)', fontWeight: 600, background: 'var(--admin-bg)' }}
                >
                  <MenuItem value="all">Tất cả</MenuItem>
                  <MenuItem value="order">Đăng ký gói</MenuItem>
                  <MenuItem value="equipment">Thiết bị</MenuItem>
                  <MenuItem value="package">Gói tập</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
                  <MenuItem value="employee">Nhân viên mới</MenuItem>
                  <MenuItem value="trainer">Trainer mới</MenuItem>
                  {/* Thêm các loại khác nếu có */}
                </Select>
              }
              sx={{ borderBottom: '1px solid var(--admin-border)' }}
            />
            <Divider sx={{ borderColor: 'var(--admin-border)' }} />
            <CardContent>
              <ul style={{ paddingLeft: 16 }}>
                {filteredRecent.length === 0 && <li>Không có hoạt động gần đây</li>}
                {filteredRecent.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <span style={{ color: '#4f8cff', fontWeight: 600 }}>{new Date(item.time).toLocaleString('vi-VN')}</span> - {item.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
            <CardHeader
              title={<span style={{ color: 'var(--admin-text)', fontWeight: 600 }}>Thống kê doanh thu</span>}
              action={
                <Select
                  value={revenueFilter}
                  onChange={e => setRevenueFilter(e.target.value)}
                  size="small"
                  sx={{ minWidth: 120, color: 'var(--admin-primary)', fontWeight: 600, background: 'var(--admin-bg)' }}
                >
                  <MenuItem value="day">Theo ngày</MenuItem>
                  <MenuItem value="month">Theo tháng</MenuItem>
                  <MenuItem value="year">Theo năm</MenuItem>
                </Select>
              }
              sx={{ borderBottom: '1px solid var(--admin-border)' }}
            />
            <Divider sx={{ borderColor: 'var(--admin-border)' }} />
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={revenueChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={d => {
                      if (revenueFilter === 'day') return d; // ngày trong tháng
                      if (revenueFilter === 'month') return d; // Th1, Th2, ...
                      if (revenueFilter === 'year') return d; // năm
                      return d;
                    }}
                  />
                  <YAxis width={90} tickFormatter={v => v.toLocaleString('vi-VN')} />
                  <ChartTooltip formatter={v => v.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} />
                  <Line type="monotone" dataKey="revenue" stroke="#4f8cff" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 