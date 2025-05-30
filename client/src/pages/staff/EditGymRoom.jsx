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
  DialogActions
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const EditGymRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    roomType: 'cardio',
    status: 'active'
  });
  const [equipment, setEquipment] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [equipmentToDelete, setEquipmentToDelete] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          navigate('/auth/login');
          return;
        }

        const response = await axios.get(`http://localhost:8001/api/gymrooms/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setForm(response.data);

        // Fetch equipment list for this room
        const equipmentResponse = await axios.get(`http://localhost:8001/api/equipments/room/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setEquipment(equipmentResponse.data);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError(err.response?.data?.message || 'Không thể tải thông tin phòng tập. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [id, navigate]);

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

      await axios.put(`http://localhost:8001/api/gymrooms/${id}`, form, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Cập nhật phòng tập thành công!');
      navigate('/staff/gymrooms');
    } catch (err) {
      console.error('Error updating room:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật phòng tập. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
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

      await axios.delete(`http://localhost:8001/api/equipments/${equipmentToDelete}/room`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Refresh equipment list
      const equipmentResponse = await axios.get(`http://localhost:8001/api/equipments/room/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setEquipment(equipmentResponse.data);
      alert('Xóa thiết bị khỏi phòng tập thành công!');
    } catch (err) {
      console.error('Error removing equipment:', err);
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
      <div className="bg-white min-h-screen p-6">
        <div className="text-center text-[#333]">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1a237e' }}>
        Chỉnh sửa phòng tập
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

            <div>
              <Typography variant="h6" className="font-semibold mb-2" sx={{ color: '#1a237e' }}>
                Thiết bị trong phòng
              </Typography>
              {equipment.length === 0 ? (
                <Typography sx={{ color: '#333' }}>Chưa có thiết bị nào</Typography>
              ) : (
                <List>
                  {equipment.map((item, index) => (
                    <React.Fragment key={item._id}>
                      <ListItem
                        secondaryAction={
                          <IconButton 
                            edge="end" 
                            aria-label="delete"
                            onClick={() => handleDeleteEquipment(item._id)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={
                            <Typography sx={{ color: '#333' }}>
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Box className="mt-1">
                              <Chip
                                label={getStatusLabel(item.status)}
                                color={item.status === 'active' ? 'success' : 
                                       item.status === 'maintenance' ? 'warning' : 'error'}
                                size="small"
                                className="mr-2"
                              />
                              <Typography variant="body2" sx={{ color: '#666', display: 'inline' }}>
                                {item.description}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < equipment.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </div>
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
              {loading ? <CircularProgress size={24} /> : 'Lưu'}
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

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ color: '#1a237e' }}>Xác nhận xóa</DialogTitle>
        <DialogContent sx={{ color: '#333' }}>
          Bạn có chắc chắn muốn xóa thiết bị này khỏi phòng tập?
        </DialogContent>
        <DialogActions>
          <Button 
            variant="outlined" 
            onClick={() => setOpenConfirm(false)}
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
          <Button 
            variant="contained" 
            onClick={handleDeleteEquipmentConfirm}
            sx={{ 
              backgroundColor: 'var(--admin-primary)',
              '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditGymRoom; 