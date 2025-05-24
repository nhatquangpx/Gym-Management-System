import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';

export default function AddSchedule() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    member: '',
    trainer: '',
    startDate: '',
    endDate: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/staff/schedules');
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
          Thêm lịch tập mới
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField 
            label="Tên lịch tập" 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            fullWidth 
            required 
            margin="normal" 
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField 
            label="Hội viên" 
            name="member" 
            value={form.member} 
            onChange={handleChange} 
            fullWidth 
            required 
            margin="normal" 
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField 
            label="Huấn luyện viên" 
            name="trainer" 
            value={form.trainer} 
            onChange={handleChange} 
            fullWidth 
            required 
            margin="normal" 
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField 
            label="Ngày bắt đầu" 
            name="startDate" 
            type="date" 
            value={form.startDate} 
            onChange={handleChange} 
            fullWidth 
            required 
            margin="normal" 
            InputLabelProps={{ shrink: true, style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField 
            label="Ngày kết thúc" 
            name="endDate" 
            type="date" 
            value={form.endDate} 
            onChange={handleChange} 
            fullWidth 
            required 
            margin="normal" 
            InputLabelProps={{ shrink: true, style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField 
            label="Ghi chú" 
            name="notes" 
            value={form.notes} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <Box className="flex gap-4 mt-6">
            <Button variant="contained" color="primary" type="submit" disabled={loading} sx={{ backgroundColor: 'var(--admin-primary)', color: 'var(--trainer-text)', '&:hover': { backgroundColor: 'var(--admin-accent)' } }}>Lưu</Button>
            <Button variant="outlined" onClick={() => navigate('/staff/schedules')} sx={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)', '&:hover': { borderColor: 'var(--admin-primary)' } }}>Hủy</Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 