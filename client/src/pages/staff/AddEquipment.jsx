import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, TextField, Button, MenuItem, FormControl, InputLabel, Select } from '@mui/material';

export default function AddEquipment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    type: '',
    status: 'active',
    maintenanceDate: '',
    maintenanceNotes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/staff/equipment');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto" style={{ background: '#232323' }}>
        <Typography variant="h4" className="font-bold text-white mb-6">Thêm thiết bị mới</Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField label="Tên thiết bị" name="name" value={form.name} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Loại thiết bị" name="type" value={form.type} onChange={handleChange} fullWidth required margin="normal" InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <FormControl fullWidth margin="normal">
            <InputLabel style={{ color: '#fff' }}>Trạng thái</InputLabel>
            <Select name="status" value={form.status} onChange={handleChange} label="Trạng thái" sx={{ color: '#fff' }}>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="maintenance">Bảo trì</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Ngày bảo trì" name="maintenanceDate" type="date" value={form.maintenanceDate} onChange={handleChange} fullWidth margin="normal" InputLabelProps={{ shrink: true, style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <TextField label="Ghi chú bảo trì" name="maintenanceNotes" value={form.maintenanceNotes} onChange={handleChange} fullWidth margin="normal" multiline rows={3} InputLabelProps={{ style: { color: '#fff' } }} InputProps={{ style: { color: '#fff' } }} />
          <Box className="flex gap-4 mt-6">
            <Button variant="contained" color="primary" type="submit" disabled={loading}>Lưu</Button>
            <Button variant="outlined" onClick={() => navigate('/staff/equipment')}>Hủy</Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 