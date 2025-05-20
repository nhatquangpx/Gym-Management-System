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
    <div className="p-6">
      <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto" style={{ background: '#232323' }}>
        <Typography variant="h4" className="font-bold text-white mb-6">Thêm lịch tập mới</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Tên lịch tập" name="name" value={form.name} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Hội viên" name="member" value={form.member} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Huấn luyện viên" name="trainer" value={form.trainer} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Ngày bắt đầu" name="startDate" type="date" value={form.startDate} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ shrink: true, style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Ngày kết thúc" name="endDate" type="date" value={form.endDate} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ shrink: true, style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Ghi chú" name="notes" value={form.notes} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <Box className="flex gap-4 mt-6">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>Lưu</Button>
            <Button variant="outlined" onClick={() => navigate('/staff/schedules')}>Hủy</Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 