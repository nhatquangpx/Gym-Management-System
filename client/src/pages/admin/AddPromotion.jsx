import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';

export default function AddPromotion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    description: '',
    percent: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Gửi dữ liệu lên API (giả lập)
      // await fetch('/api/promotions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      alert('Tạo ưu đãi thành công!');
      navigate('/admin/promotions');
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
          Thêm ưu đãi mới
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            label="Chi tiết ưu đãi" 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            fullWidth 
            required 
            margin="normal" 
            multiline
            rows={3}
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField 
            label="Phần trăm ưu đãi (%)" 
            name="percent" 
            type="number"
            value={form.percent} 
            onChange={handleChange} 
            fullWidth 
            required 
            margin="normal" 
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
            inputProps={{ min: 1, max: 100 }}
          />
          <Box className="flex gap-4 mt-6">
            <Button 
              variant="contained"
              sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary-dark)' } }}
              type="submit"
              disabled={loading}
            >
              Lưu
            </Button>
            <Button variant="outlined" onClick={() => navigate('/admin/promotions')} sx={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)', '&:hover': { borderColor: 'var(--admin-primary)', color: 'var(--admin-primary)' } }}>Hủy</Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 