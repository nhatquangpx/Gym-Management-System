import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';

export default function AddMember() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/staff/members');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
    setLoading(false);
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
      <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto" sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
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
          Thêm hội viên mới
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Tên hội viên" name="name" value={form.name} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: 'var(--admin-text)' } }} InputProps={{ style: { color: 'var(--admin-text)' } }} sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }} />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: 'var(--admin-text)' } }} InputProps={{ style: { color: 'var(--admin-text)' } }} sx={{ '.MuiOutlinedInput-notchedInput': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }} />
          <TextField label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: 'var(--admin-text)' } }} InputProps={{ style: { color: 'var(--admin-text)' } }} sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }} />
          <TextField label="Ngày sinh" name="dob" type="date" value={form.dob} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ shrink: true, style: { color: 'var(--admin-text)' } }} InputProps={{ style: { color: 'var(--admin-text)' } }} sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }} />
          <TextField label="Địa chỉ" name="address" value={form.address} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ style: { color: 'var(--admin-text)' } }} InputProps={{ style: { color: 'var(--admin-text)' } }} sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }} />
          <Box className="flex gap-4 mt-6">
            <Button variant="contained" sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary-dark)' } }} type="submit" disabled={loading}>Lưu</Button>
            <Button variant="outlined" onClick={() => navigate('/staff/members')} sx={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)', '&:hover': { borderColor: 'var(--admin-primary)', color: 'var(--admin-primary)' } }}>Hủy</Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 