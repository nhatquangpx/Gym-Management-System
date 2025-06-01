import { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  CircularProgress,
  Select,
  MenuItem
} from '@mui/material';
import {
  People,
  FitnessCenter,
  Build,
  History,
  Feedback as FeedbackIcon,
  MeetingRoom
} from '@mui/icons-material';

const statsConfig = [
  { label: 'Hội viên', icon: <People sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, key: 'members', color: 'var(--admin-primary)' },
  { label: 'Gói tập', icon: <FitnessCenter sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, key: 'packages', color: 'var(--admin-primary)' },
  { label: 'Thiết bị', icon: <Build sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, key: 'equipment', color: 'var(--admin-primary)' },
  { label: 'Phản hồi', icon: <FeedbackIcon sx={{ fontSize: 30, color: 'var(--admin-primary)' }} />, key: 'feedback', color: 'var(--admin-primary)' },
];

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    packages: 0,
    equipment: 0,
    feedback: 0,
    loading: true
  });
  const [recent, setRecent] = useState([]);
  const [activityType, setActivityType] = useState('all');

  useEffect(() => {
    async function fetchStats() {
      setStats(s => ({ ...s, loading: true }));
      const token = localStorage.getItem('token');
      const headers = { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      try {
        const [
          membersRes,
          packagesRes,
          equipmentRes,
          feedbackRes
        ] = await Promise.all([
          fetch('/api/members', { headers }),
          fetch('/api/packages', { headers }),
          fetch('/api/equipments', { headers }),
          fetch('/api/feedbacks', { headers }),
        ]);

        // Check if responses are ok before parsing JSON
        if (!membersRes.ok || !packagesRes.ok || !equipmentRes.ok || !feedbackRes.ok) {
          throw new Error('One or more API requests failed');
        }

        const [
          members,
          packages,
          equipment,
          feedback
        ] = await Promise.all([
          membersRes.json(),
          packagesRes.json(),
          equipmentRes.json(),
          feedbackRes.json(),
        ]);

        // Xử lý dữ liệu mảng
        const membersArr = Array.isArray(members) ? members : (members.data || members.members || []);
        const packagesArr = Array.isArray(packages) ? packages : (packages.data || packages.packages || []);
        const equipmentArr = Array.isArray(equipment) ? equipment : (equipment.data || equipment.equipments || []);
        const feedbacksArr = Array.isArray(feedback) ? feedback : (feedback.data || feedback.feedbacks || []);

        // Recent activities (CRUD for all types)
        const recentList = [];
        const pushCrudLog = (arr, type, getName) => {
          arr.forEach(item => {
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
          });
        };

        // Log activities for each type
        pushCrudLog(membersArr, 'member', m => `Hội viên ${m.name || 'N/A'}`);
        pushCrudLog(equipmentArr, 'equipment', eq => `Thiết bị ${eq.name}`);
        pushCrudLog(feedbacksArr, 'feedback', fb => `Feedback của hội viên ${fb.memberName || 'N/A'}`);

        // Sắp xếp và lấy 10 hoạt động mới nhất
        recentList.sort((a, b) => new Date(b.time) - new Date(a.time));
        setRecent(recentList.slice(0, 10));

        setStats({
          members: membersArr.length,
          packages: packagesArr.length,
          equipment: equipmentArr.length,
          feedback: feedbacksArr.length,
          loading: false
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
        setStats(s => ({ ...s, loading: false }));
      }
    }
    fetchStats();
  }, []);

  if (stats.loading) {
    return <Box sx={{ p: 3, background: 'var(--admin-bg)', minHeight: '100vh' }}><CircularProgress /></Box>;
  }

  // Filter activities
  const filteredRecent = activityType === 'all'
    ? recent
    : recent.filter(item => item.type === activityType);

  return (
    <Box sx={{ p: 3, background: 'var(--admin-bg)', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', mb: 4 }}>
        Dashboard tổng quan
      </Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {statsConfig.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
            <Card sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderLeft: `4px solid ${stat.color}`, width: '100%', minWidth: 0 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" color="var(--admin-text)" gutterBottom>
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: 'var(--admin-text)', fontWeight: 700 }}>
                      {stats[stat.key]}
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
        <Grid item xs={12}>
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
                  <MenuItem value="member">Hội viên</MenuItem>
                  <MenuItem value="equipment">Thiết bị</MenuItem>
                  <MenuItem value="feedback">Feedback</MenuItem>
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
      </Grid>
    </Box>
  );
} 