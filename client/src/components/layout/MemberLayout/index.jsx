import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { useAuth } from '../../../contexts/AuthContext';

const MemberLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gym Management System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/member/dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/member/profile')}>Profile</Button>
          <Button color="inherit" onClick={() => navigate('/member/packages')}>Packages</Button>
          <Button color="inherit" onClick={() => navigate('/member/workouts')}>Workouts</Button>
          <Button color="inherit" onClick={() => navigate('/member/schedules')}>Schedules</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MemberLayout; 