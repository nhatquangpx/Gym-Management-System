import { useEffect, useState } from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BuildIcon from '@mui/icons-material/Build';
import HistoryIcon from '@mui/icons-material/History';
import FeedbackIcon from '@mui/icons-material/Feedback';

const statsConfig = [
  { label: 'Hội viên', icon: <GroupIcon fontSize="large" />, key: 'members', color: '#e53935' },
  { label: 'Gói tập', icon: <FitnessCenterIcon fontSize="large" />, key: 'packages', color: '#b71c1c' },
  { label: 'Thiết bị', icon: <BuildIcon fontSize="large" />, key: 'equipment', color: '#fbc02d' },
  { label: 'Buổi tập', icon: <HistoryIcon fontSize="large" />, key: 'workouts', color: '#1976d2' },
  { label: 'Phản hồi', icon: <FeedbackIcon fontSize="large" />, key: 'feedback', color: '#43a047' },
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
    <div>
      <Typography variant="h4" className="font-bold text-white mb-8">Dashboard tổng quan</Typography>
      <Grid container spacing={4}>
        {statsConfig.map((item) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={item.key}>
            <Paper className="p-6 flex flex-col items-center shadow-lg rounded-xl" style={{ background: '#232323' }}>
              <Box className="mb-2" style={{ color: item.color }}>{item.icon}</Box>
              <Typography variant="h5" className="font-bold text-white mb-1">
                {loading ? '...' : stats[item.key]}
              </Typography>
              <Typography className="text-[#D4D4D4] text-base">{item.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
} 