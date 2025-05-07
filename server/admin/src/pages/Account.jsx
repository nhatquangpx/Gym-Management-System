import Avatar from '@mui/material/Avatar';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Paper, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Account() {
  const user = {
    name: 'Nguyễn Văn Admin',
    email: 'admin@gym.com',
    phone: '0901234567',
    role: 'Quản trị viên',
    avatar: 'https://i.pravatar.cc/150?img=1',
  };
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/profile/edit');
  };

  return (
    <Box sx={{ p: 3, background: '#181818', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
        Tài khoản admin
      </Typography>
      <Paper sx={{ p: 4, background: '#232323', color: '#fff', maxWidth: 400, mx: 'auto', borderRadius: 4, boxShadow: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={user.avatar} alt={user.name} sx={{ width: 120, height: 120, mb: 2, border: '4px solid #e53935', boxShadow: '0 4px 24px #e5393533' }} />
          <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>{user.name}</Typography>
          <Typography variant="body1" color="#e53935" gutterBottom sx={{ fontWeight: 600 }}>{user.role}</Typography>
          <Typography variant="body2" color="#D4D4D4">Email: {user.email}</Typography>
          <Typography variant="body2" color="#D4D4D4">SĐT: {user.phone}</Typography>
          <Button
            variant="outlined"
            startIcon={<EditIcon sx={{ color: '#e53935' }} />}
            sx={{ mt: 3, color: '#e53935', borderColor: '#e53935', '&:hover': { borderColor: '#e53935', background: '#1f1f1f' } }}
            onClick={handleEdit}
          >
            Chỉnh sửa thông tin
          </Button>
        </Box>
      </Paper>
    </Box>
  );
} 