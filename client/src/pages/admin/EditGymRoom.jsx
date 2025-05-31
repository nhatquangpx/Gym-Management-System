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
        <CircularProgress sx={{ color: '#1a237e' }} />
      </Box>
    );
  }

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
          Chỉnh sửa phòng tập
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
              {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
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
            variant="contained"
            onClick={handleDeleteEquipmentConfirm}
            sx={{
              backgroundColor: '#1a237e',
              '&:hover': { backgroundColor: '#283593' }
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 