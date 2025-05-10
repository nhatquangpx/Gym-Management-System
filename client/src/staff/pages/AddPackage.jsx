import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, TextField, Button } from '@mui/material';

export default function AddPackage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/staff/packages');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto" style={{ background: '#232323' }}>
        <Typography variant="h4" className="font-bold text-white mb-6">Thêm gói tập mới</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Tên gói tập" name="name" value={form.name} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Giá" name="price" value={form.price} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Thời hạn" name="duration" value={form.duration} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Mô tả" name="description" value={form.description} onChange={handleChange} fullWidth multiline rows={3} margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <Box className="flex gap-4 mt-6">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>Lưu</Button>
            <Button variant="outlined" onClick={() => navigate('/staff/packages')}>Hủy</Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 