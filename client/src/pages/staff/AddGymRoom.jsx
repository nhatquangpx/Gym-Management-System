import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const AddGymRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    roomType: 'cardio',
    status: 'active'
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }

      await axios.post('http://localhost:8001/api/gymrooms', form, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Thêm phòng tập thành công!');
      navigate('/staff/gymrooms');
    } catch (err) {
      console.error('Error adding room:', err);
      setError(err.response?.data?.message || 'Không thể thêm phòng tập. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1a237e' }}>
        Thêm phòng tập mới
      </Typography>

      {error && (
        <Box className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </Box>
      )}

      <Paper className="p-6 max-w-lg mx-auto">
        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Tên phòng"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              sx={{ '& .MuiInputLabel-root': { color: '#1a237e' } }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#1a237e' }}>Trạng thái</InputLabel>
              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
                label="Trạng thái"
                sx={{ '& .MuiSelect-icon': { color: '#1a237e' } }}
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#1a237e' }}>Loại phòng</InputLabel>
              <Select
                name="roomType"
                value={form.roomType}
                onChange={handleChange}
                label="Loại phòng"
                sx={{ '& .MuiSelect-icon': { color: '#1a237e' } }}
              >
                <MenuItem value="cardio">Cardio</MenuItem>
                <MenuItem value="strength">Tập sức mạnh</MenuItem>
                <MenuItem value="yoga">Yoga</MenuItem>
                <MenuItem value="functional">Tập chức năng</MenuItem>
                <MenuItem value="group">Tập nhóm</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ 
                backgroundColor: 'var(--admin-primary)',
                '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Thêm phòng tập'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/staff/gymrooms')}
              sx={{ 
                color: 'var(--admin-primary)', 
                borderColor: 'var(--admin-primary)',
                '&:hover': {
                  borderColor: 'var(--admin-primary)',
                  backgroundColor: 'rgba(26, 35, 126, 0.04)'
                }
              }}
            >
              Hủy
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
};

export default AddGymRoom; 