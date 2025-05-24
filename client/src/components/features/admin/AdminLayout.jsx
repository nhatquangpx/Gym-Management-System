import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: 'var(--admin-bg)' }}>
      <Sidebar />
      <Box sx={{ flexGrow: 1, marginLeft: '290px' }}>
        <Header />
        <Box component="main" sx={{ p: 3, pt: '80px' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
} 