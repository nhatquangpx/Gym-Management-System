import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  Save,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: 'Nguyễn Văn Admin',
    email: 'admin@gym.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    avatar: 'https://i.pravatar.cc/150?img=1',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Xử lý lưu thông tin ở đây
    navigate('/account');
  };

  return (
    <Box sx={{ p: 3, background: '#181818', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
        Chỉnh sửa thông tin cá nhân
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 4, boxShadow: 6, background: '#232323', color: '#fff' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar src={form.avatar} alt={form.name} sx={{ width: 100, height: 100, mb: 2, border: '4px solid #e53935', boxShadow: '0 4px 24px #e5393533' }} />
        </Box>
        <form onSubmit={handleSave}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="name"
                value={form.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Person sx={{ mr: 1, color: '#e53935' }} />
                  ),
                }}
                sx={{ input: { color: '#fff' }, label: { color: '#D4D4D4' }, bgcolor: '#181818', borderRadius: 2, mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Email sx={{ mr: 1, color: '#e53935' }} />
                  ),
                }}
                sx={{ input: { color: '#fff' }, label: { color: '#D4D4D4' }, bgcolor: '#181818', borderRadius: 2, mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Phone sx={{ mr: 1, color: '#e53935' }} />
                  ),
                }}
                sx={{ input: { color: '#fff' }, label: { color: '#D4D4D4' }, bgcolor: '#181818', borderRadius: 2, mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Địa chỉ"
                name="address"
                value={form.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <LocationOn sx={{ mr: 1, color: '#e53935' }} />
                  ),
                }}
                sx={{ input: { color: '#fff' }, label: { color: '#D4D4D4' }, bgcolor: '#181818', borderRadius: 2, mb: 2 }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{ color: '#e53935', borderColor: '#e53935', '&:hover': { borderColor: '#e53935', background: '#1f1f1f' } }}
              onClick={() => navigate('/account')}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{ bgcolor: '#e53935', fontWeight: 700, '&:hover': { bgcolor: '#b71c1c' } }}
            >
              Lưu thay đổi
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
} 