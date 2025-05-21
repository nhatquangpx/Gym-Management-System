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
    <div className="p-6" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
      <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto" sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Typography variant="h4" className="font-bold mb-6" sx={{ color: 'var(--admin-text)' }}>Thêm gói tập mới</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField 
            label="Tên gói tập"
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
            label="Giá"
            name="price"
            value={form.price}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField 
            label="Thời hạn"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField 
            label="Mô tả"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <Box className="flex gap-4 mt-6">
            <Button 
              variant="contained"
              sx={{ 
                backgroundColor: 'var(--admin-primary)',
                '&:hover': { backgroundColor: 'var(--admin-primary-dark)' }
              }}
              type="submit"
              disabled={loading}
            >
              Lưu
            </Button>
            <Button variant="outlined" onClick={() => navigate('/staff/packages')} sx={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)', '&:hover': { borderColor: 'var(--admin-primary)', color: 'var(--admin-primary)' } }}>Hủy</Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 