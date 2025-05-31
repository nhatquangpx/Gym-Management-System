import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  List,
  Button,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

export default function EditGymRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    roomType: 'cardio',
    status: 'active'
  });
  const [equipment, setEquipment] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);
  const [openSaveConfirm, setOpenSaveConfirm] = useState(false);
  const [pendingSubmit, setPendingSubmit] = useState(false);

  useEffect(() => {
    fetchGymRoom();
  }, [id]);

  const fetchGymRoom = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }

      const response = await fetch(`http://localhost:8001/api/gymrooms/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch gym room');
      }

      const data = await response.json();
      setFormData(data);

      // Fetch equipment list for this room
      const equipmentResponse = await fetch(`http://localhost:8001/api/equipments/room/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!equipmentResponse.ok) {
        throw new Error('Failed to fetch equipment');
      }
      const equipmentData = await equipmentResponse.json();
      setEquipment(equipmentData);
    } catch (error) {
      console.error('Error fetching gym room:', error);
      setError('Không thể tải thông tin phòng tập');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    setOpenSaveConfirm(true);
  };

  const handleSubmit = async () => {
    setPendingSubmit(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      const response = await fetch(`http://localhost:8001/api/gymrooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update gym room');
      }
      alert('Cập nhật phòng tập thành công!');
      navigate('/admin/gymrooms');
    } catch (error) {
      console.error('Error updating gym room:', error);
      setError(error.message || 'Lỗi khi cập nhật phòng tập');
    } finally {
      setPendingSubmit(false);
      setOpenSaveConfirm(false);
    }
  };

  const handleDeleteEquipment = (equipmentId) => {
    setEquipmentToDelete(equipmentId);
    setOpenConfirm(true);
  };

  const handleDeleteEquipmentConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }

      const response = await fetch(`http://localhost:8001/api/equipments/${equipmentToDelete}/room`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove equipment');
      }

      // Refresh equipment list
      const equipmentResponse = await fetch(`http://localhost:8001/api/equipments/room/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!equipmentResponse.ok) {
        throw new Error('Failed to fetch equipment');
      }
      const equipmentData = await equipmentResponse.json();
      setEquipment(equipmentData);
      alert('Xóa thiết bị khỏi phòng tập thành công!');
    } catch (error) {
      console.error('Error removing equipment:', error);
      alert('Không thể xóa thiết bị. Vui lòng thử lại sau.');
    } finally {
      setOpenConfirm(false);
      setEquipmentToDelete(null);
    }
  };

  const getRoomTypeLabel = (type) => {
    switch(type) {
      case 'cardio': return 'Cardio';
      case 'strength': return 'Tập sức mạnh';
      case 'yoga': return 'Yoga';
      case 'functional': return 'Tập chức năng';
      case 'group': return 'Tập nhóm';
      default: return type;
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'active': return 'Hoạt động';
      case 'maintenance': return 'Bảo trì';
      case 'inactive': return 'Không hoạt động';
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: 'var(--admin-primary)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, color: 'var(--admin-text)' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
      <Paper sx={{ p: 3, backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Typography variant="h4" sx={{ color: 'var(--admin-primary)', mb: 3 }}>
          Chỉnh sửa phòng tập
        </Typography>
        <form onSubmit={handleSaveClick}>
          <TextField
            fullWidth
            label="Tên phòng"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            sx={{ mb: 2, '& .MuiInputLabel-root': { color: 'var(--admin-text)' }, '& .MuiOutlinedInput-root': { color: 'var(--admin-text)', '& fieldset': { borderColor: 'var(--admin-border)' } } }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Loại phòng</InputLabel>
            <Select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              required
              label="Loại phòng"
              sx={{ color: 'var(--admin-text)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' } }}
            >
              <MenuItem value="cardio">Cardio</MenuItem>
              <MenuItem value="strength">Tập sức mạnh</MenuItem>
              <MenuItem value="yoga">Yoga</MenuItem>
              <MenuItem value="functional">Tập chức năng</MenuItem>
              <MenuItem value="group">Tập nhóm</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              label="Trạng thái"
              sx={{ color: 'var(--admin-text)', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' } }}
            >
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="maintenance">Bảo trì</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained" sx={{ bgcolor: 'var(--admin-primary)', '&:hover': { bgcolor: 'var(--admin-primary-dark)' } }} disabled={pendingSubmit}>
              Lưu
            </Button>
            <Button variant="outlined" onClick={() => navigate('/admin/gymrooms')} sx={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)', '&:hover': { borderColor: 'var(--admin-primary)', color: 'var(--admin-primary)' } }}>
              Hủy
            </Button>
          </Box>
        </form>
      </Paper>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ color: 'var(--admin-primary)' }}>Xác nhận xóa</DialogTitle>
        <DialogContent sx={{ color: 'var(--admin-text)' }}>
          Bạn có chắc chắn muốn xóa thiết bị này khỏi phòng tập?
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => setOpenConfirm(false)}
            sx={{
              color: 'var(--admin-primary)',
              borderColor: 'var(--admin-border)',
              '&:hover': {
                borderColor: 'var(--admin-primary)',
                backgroundColor: 'rgba(26, 35, 126, 0.04)'
              }
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteEquipmentConfirm}
            sx={{
              backgroundColor: 'var(--admin-primary)',
              '&:hover': { backgroundColor: 'var(--admin-primary-dark)' }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSaveConfirm} onClose={() => setOpenSaveConfirm(false)}>
        <DialogTitle>Xác nhận lưu thay đổi</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn lưu các thay đổi này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveConfirm(false)} color="inherit">Hủy</Button>
          <Button onClick={handleSubmit} color="primary" variant="contained" disabled={pendingSubmit}>Đồng ý</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 