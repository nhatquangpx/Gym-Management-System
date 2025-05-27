import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Grid, TextField, Button,
  MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function AddEquipment() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState({
    name: '',
    description: '',
    status: 'active',
    purchaseDate: '',
    warrantyDate: '',
    roomId: ''
  });
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
    setLoading(false);
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch('http://localhost:8001/api/gymrooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách phòng tập');
      }
      
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phòng tập:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!equipment.roomId) {
      alert('Vui lòng chọn phòng tập cho thiết bị');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch('http://localhost:8001/api/equipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(equipment),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo thiết bị');
      }
      
      alert('Thiết bị đã được tạo thành công!');
      navigate('/admin/equipment');
    } catch (error) {
      console.error('Lỗi khi tạo thiết bị:', error);
      alert('Lỗi khi tạo thiết bị: ' + error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/equipment')}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Lưu
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          Thêm thiết bị mới
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên thiết bị"
                name="name"
                value={equipment.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Phòng tập</InputLabel>
                <Select
                  name="roomId"
                  value={equipment.roomId}
                  onChange={handleChange}
                  label="Phòng tập"
                >
                  {rooms.map(room => (
                    <MenuItem key={room._id} value={room._id}>
                      {room.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={equipment.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="maintenance">Bảo trì</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày mua"
                name="purchaseDate"
                type="date"
                value={equipment.purchaseDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Ngày hết hạn bảo hành"
                name="warrantyDate"
                type="date"
                value={equipment.warrantyDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Mô tả"
                name="description"
                value={equipment.description}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
} 