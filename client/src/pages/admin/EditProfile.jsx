import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  CircularProgress
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

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    avatar: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || ''
        });
      } catch (err) {
        console.log('Lỗi khi lấy thông tin');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const userId = JSON.parse(localStorage.getItem('user')).id;
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        navigate('/admin/account');
      } else {
        console.log('Lỗi khi cập nhật thông tin');
      }
    } catch (err) {
      console.log('Lỗi khi cập nhật thông tin');
    }
    setSaving(false);
  };

  if (loading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3, backgroundColor: 'var(--admin-bg)', minHeight: '100vh', color: 'var(--admin-text)' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', mb: 4 }}>
        Chỉnh sửa thông tin cá nhân
      </Typography>
      <Paper sx={{ p: 4, maxWidth: 600, mx: 'auto', borderRadius: 4, boxShadow: 6, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar src={form.avatar} alt={form.name} sx={{ width: 100, height: 100, mb: 2, border: '4px solid var(--admin-primary)', boxShadow: '0 4px 24px rgba(var(--admin-primary-rgb), 0.2)' }} />
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
                    <Person sx={{ mr: 1, color: 'var(--admin-primary)' }} />
                  ),
                }}
                sx={{ input: { color: 'var(--admin-text)' }, label: { color: 'var(--admin-text-secondary)' }, bgcolor: 'var(--admin-header)', borderRadius: 2, mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'var(--admin-border)' }, '&:hover fieldset': { borderColor: 'var(--admin-primary)' }, '&.Mui-focused fieldset': { borderColor: 'var(--admin-primary)' } }}}
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
                    <Email sx={{ mr: 1, color: 'var(--admin-primary)' }} />
                  ),
                }}
                sx={{ input: { color: 'var(--admin-text)' }, label: { color: 'var(--admin-text-secondary)' }, bgcolor: 'var(--admin-header)', borderRadius: 2, mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'var(--admin-border)' }, '&:hover fieldset': { borderColor: 'var(--admin-primary)' }, '&.Mui-focused fieldset': { borderColor: 'var(--admin-primary)' } }}}
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
                    <Phone sx={{ mr: 1, color: 'var(--admin-primary)' }} />
                  ),
                }}
                sx={{ input: { color: 'var(--admin-text)' }, label: { color: 'var(--admin-text-secondary)' }, bgcolor: 'var(--admin-header)', borderRadius: 2, mb: 2, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'var(--admin-border)' }, '&:hover fieldset': { borderColor: 'var(--admin-primary)' }, '&.Mui-focused fieldset': { borderColor: 'var(--admin-primary)' } }}}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              sx={{ color: 'var(--admin-primary)', borderColor: 'var(--admin-primary)', '&:hover': { borderColor: 'var(--admin-primary-dark)', background: 'rgba(var(--admin-primary-rgb), 0.1)' } }}
              onClick={() => navigate('/admin/account')}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<Save />}
              sx={{ bgcolor: 'var(--admin-primary)', fontWeight: 700, '&:hover': { bgcolor: 'var(--admin-primary-dark)' } }}
              disabled={saving}
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
} 