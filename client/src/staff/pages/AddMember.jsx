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
    <div className="p-6">
      <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto" style={{ background: '#232323' }}>
        <Typography variant="h4" className="font-bold text-white mb-6">Thêm hội viên mới</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Tên hội viên" name="name" value={form.name} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Số điện thoại" name="phone" value={form.phone} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Ngày sinh" name="dob" type="date" value={form.dob} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ shrink: true, style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Địa chỉ" name="address" value={form.address} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <Box className="flex gap-4 mt-6">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>Lưu</Button>
            <Button variant="outlined" onClick={() => navigate('/staff/members')}>Hủy</Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 