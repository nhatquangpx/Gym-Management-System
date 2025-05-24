import { useEffect, useState } from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BuildIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import FeedbackIcon from '@mui/icons-material/Feedback';

const statsConfig = [
  { label: 'Hội viên', icon: <GroupIcon fontSize="large" />, key: 'members', color: 'var(--admin-primary)' },
  { label: 'Gói tập', icon: <FitnessCenterIcon fontSize="large" />, key: 'packages', color: 'var(--admin-primary)' },
  { label: 'Thiết bị', icon: <BuildIcon fontSize="large" />, key: 'equipment', color: 'var(--admin-primary)' },
  { label: 'Buổi tập', icon: <HistoryIcon fontSize="large" />, key: 'workouts', color: 'var(--admin-primary)' },
  { label: 'Phản hồi', icon: <FeedbackIcon fontSize="large" />, key: 'feedback', color: 'var(--admin-primary)' },
];

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    members: 0,
    packages: 0,
    equipment: 0,
    workouts: 0,
    feedback: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập fetch API, sau này thay bằng API thực tế
    async function fetchStats() {
      setLoading(true);
      // TODO: Thay bằng gọi API thực tế
      setTimeout(() => {
        setStats({
          members: 120,
          packages: 5,
          equipment: 30,
          workouts: 250,
          feedback: 18,
        });
        setLoading(false);
      }, 600);
    }
    fetchStats();
  }, []);

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <Typography
        variant="h4"
        className="font-bold"
        sx={{
          color: '#4f8cff',
          fontWeight: 700,
          fontSize: '2.2em',
          mb: 4
        }}
      >
        Dashboard tổng quan
      </Typography>
      <Grid container spacing={4}>
        {statsConfig.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={item.key}>
            <Paper className="p-6 flex flex-col items-center shadow-lg rounded-xl" style={{ background: 'var(--admin-sidebar)' }}>
              <Box className="mb-2" style={{ color: item.color }}>{item.icon}</Box>
              <Typography variant="h5" className="font-bold text-[var(--admin-text)] mb-1">
                {loading ? '...' : stats[item.key]}
              </Typography>
              <Typography className="text-[var(--admin-text)] text-base">{item.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
} 