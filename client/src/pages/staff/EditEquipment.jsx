import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, TextField, Button, MenuItem, FormControl, InputLabel, Select,
  ThemeProvider, createTheme, Alert, CircularProgress
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f8cff',
    },
  },
});

export default function EditEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'active',
    purchaseDate: '',
    warrantyDate: '',
    roomId: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchEquipment();
  }, [id]);

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
      setError(error.message);
    }
  };

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch(`http://localhost:8001/api/equipments/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch equipment');
      }
      
      const data = await response.json();
      setForm({
        ...data,
        roomId: data.roomId ? data.roomId._id || data.roomId : '',
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate).toISOString().split('T')[0] : '',
        warrantyDate: data.warrantyDate ? new Date(data.warrantyDate).toISOString().split('T')[0] : ''
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Không thể tải thông tin thiết bị: ' + error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!form.roomId) {
      setError('Vui lòng chọn phòng tập cho thiết bị');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch(`http://localhost:8001/api/equipments/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật thiết bị');
      }
      
      alert('Thiết bị đã được cập nhật thành công!');
      navigate('/staff/equipment');
    } catch (error) {
      console.error('Lỗi khi cập nhật thiết bị:', error);
      setError(error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="p-6">
        <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto">
          <Typography 
            variant="h4" 
            className="font-bold mb-6"
            sx={{ 
              color: '#4f8cff', 
              fontWeight: 700, 
              fontSize: '2.2em'
            }}
          >
            Chỉnh sửa thiết bị
          </Typography>
          
          {error && (
            <Alert severity="error" className="mb-4">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TextField 
              label="Tên thiết bị" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              fullWidth 
              required 
              margin="normal"
            />
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Phòng tập</InputLabel>
              <Select
                name="roomId"
                value={form.roomId}
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
                value={form.status} 
                onChange={handleChange} 
                label="Trạng thái"
              >
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
                <MenuItem value="inactive">Không hoạt động</MenuItem>
              </Select>
            </FormControl>
            
            <TextField 
              label="Ngày mua" 
              name="purchaseDate" 
              type="date" 
              value={form.purchaseDate} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField 
              label="Ngày hết hạn bảo hành" 
              name="warrantyDate" 
              type="date" 
              value={form.warrantyDate} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              InputLabelProps={{ shrink: true }}
            />
            
            <TextField 
              label="Mô tả" 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              multiline 
              rows={3}
            />
            
            <Box className="flex gap-4 mt-6">
              <Button 
                variant="contained" 
                color="primary" 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Đang lưu...' : 'Lưu'}
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/staff/equipment')}
              >
                Hủy
              </Button>
            </Box>
          </form>
        </Paper>
      </div>
    </ThemeProvider>
  );
} 