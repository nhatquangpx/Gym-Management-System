import React, { useEffect, useState } from 'react';
import { Grid, Paper, Typography, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MemberDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    activePackages: 0,
    upcomingWorkouts: 0,
    totalWorkouts: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/users/my-packages');
        setStats({
          activePackages: response.data.packages.length,
          upcomingWorkouts: 0, // TODO: Implement this
          totalWorkouts: 0 // TODO: Implement this
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.name}!
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Active Packages</Typography>
            <Typography variant="h4">{stats.activePackages}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Upcoming Workouts</Typography>
            <Typography variant="h4">{stats.upcomingWorkouts}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Workouts</Typography>
            <Typography variant="h4">{stats.totalWorkouts}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberDashboard; 
