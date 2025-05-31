import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';

export default function AddGymRoom() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    roomType: 'cardio',
    status: 'active'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }

      const response = await fetch('http://localhost:8001/api/gymrooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add gym room');
      }

      alert('Thêm phòng tập thành công!');
      navigate('/admin/gymrooms');
    } catch (error) {
      console.error('Error adding gym room:', error);
      setError(error.message || 'Lỗi khi thêm phòng tập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography
          variant="h4"
          className="font-bold"
          sx={{
            color: 'var(--admin-primary)',
            fontWeight: 700,
            fontSize: '2.2em',
            mb: 4
          }}
        >
          Thêm phòng tập mới
        </Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto', background: 'var(--admin-sidebar)' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Box className="space-y-4">
            <TextField
              fullWidth
              label="Tên phòng"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
              InputProps={{ style: { color: 'var(--admin-text)' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'var(--admin-primary)' },
                  '&:hover fieldset': { borderColor: 'var(--admin-primary-dark)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--admin-primary)' }
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: 'var(--admin-text)' }}>Loại phòng</InputLabel>
              <Select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
                label="Loại phòng"
                sx={{
                  color: 'var(--admin-text)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary-dark)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
                }}
              >
                <MenuItem value="cardio">Cardio</MenuItem>
                <MenuItem value="strength">Tập sức mạnh</MenuItem>
                <MenuItem value="yoga">Yoga</MenuItem>
                <MenuItem value="functional">Tập chức năng</MenuItem>
                <MenuItem value="group">Tập nhóm</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                label="Trạng thái"
                sx={{
                  color: 'var(--admin-text)',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary-dark)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
                }}
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/admin/gymrooms')}
              sx={{
                color: 'var(--admin-primary)',
                borderColor: 'var(--admin-primary)',
                '&:hover': {
                  borderColor: 'var(--admin-primary-dark)',
                  backgroundColor: 'rgba(79, 140, 255, 0.04)'
                }
              }}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                backgroundColor: 'var(--admin-primary)',
                color: 'white',
                '&:hover': { backgroundColor: 'var(--admin-primary-dark)' }
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Thêm phòng tập'}
            </Button>
          </Box>
        </form>
      </Paper>
    </div>
  );
} 