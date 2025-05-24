import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';

const fakePromotions = [
  { id: 1, startDate: '2024-06-01', endDate: '2024-06-30', description: 'Ưu đãi hè 20%', percent: 20 },
  { id: 2, startDate: '2024-07-01', endDate: '2024-07-15', description: 'Ưu đãi thành viên mới 15%', percent: 15 },
];

export default function EditPromotion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const promotion = fakePromotions.find(p => p.id === Number(id));
  const [form, setForm] = useState(promotion || {
    startDate: '',
    endDate: '',
    description: '',
    percent: ''
  });
  if (!promotion) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy ưu đãi.</div>;
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên server
    alert('Đã lưu thay đổi!');
    navigate('/admin/promotions');
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
          Chỉnh sửa ưu đãi
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