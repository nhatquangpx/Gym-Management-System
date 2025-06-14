import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Paper, Typography, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userId = JSON.parse(localStorage.getItem('user')).id;
        const token = localStorage.getItem('token');
        const res = await fetch(`/api/users/${userId}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleEdit = () => {
    navigate('/staff/profile/edit');
  };

  if (loading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;
  if (!user) return <Box sx={{ p: 3 }}>Không tìm thấy thông tin nhân viên</Box>;

  return (
    <Box sx={{ p: 3, backgroundColor: 'var(--admin-bg)', minHeight: '100vh', color: 'var(--admin-text)' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', mb: 4 }}>
        Tài khoản nhân viên
      </Typography>
      <Paper sx={{ p: 4, backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)', maxWidth: 400, mx: 'auto', borderRadius: 4, boxShadow: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 120, height: 120, mb: 2, border: '4px solid var(--admin-primary)', boxShadow: '0 4px 24px rgba(var(--admin-primary-rgb), 0.2)' }} />
          <Typography variant="h5" gutterBottom sx={{ color: 'var(--admin-text)', fontWeight: 700 }}>{user.name}</Typography>

          <Typography variant="body2" sx={{ color: 'var(--admin-text)' }}>Email: {user.email}</Typography>
          <Typography variant="body2" sx={{ color: 'var(--admin-text)' }}>SĐT: {user.phone}</Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon sx={{ color: 'var(--admin-primary)' }} />}
            sx={{
              mt: 3,
              color: 'var(--admin-primary)',
              borderColor: 'var(--admin-primary)',
              '&:hover': {
                borderColor: 'var(--admin-primary-dark)',
                color: 'var(--admin-primary-dark)',
                backgroundColor: 'rgba(var(--admin-primary-rgb), 0.1)'
              }
            }}
            onClick={handleEdit}
          >
            Chỉnh sửa thông tin
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 