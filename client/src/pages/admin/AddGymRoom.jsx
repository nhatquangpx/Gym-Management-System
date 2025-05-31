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
            color: '#1a237e',
            fontWeight: 700,
            fontSize: '2.2em',
            mb: 4
          }}
        >
          Thêm phòng tập mới
        </Typography>
      </Box>

      <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
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
              sx={{
                '& .MuiInputLabel-root': { color: '#1a237e' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#1a237e' },
                  '&:hover fieldset': { borderColor: '#283593' }
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel sx={{ color: '#1a237e' }}>Loại phòng</InputLabel>
              <Select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
                label="Loại phòng"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1a237e' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#283593' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1a237e' }
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
              <InputLabel sx={{ color: '#1a237e' }}>Trạng thái</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                label="Trạng thái"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1a237e' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#283593' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1a237e' }
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
                color: '#1a237e',
                borderColor: '#1a237e',
                '&:hover': {
                  borderColor: '#283593',
                  backgroundColor: 'rgba(26, 35, 126, 0.04)'
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
                backgroundColor: '#1a237e',
                '&:hover': { backgroundColor: '#283593' }
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