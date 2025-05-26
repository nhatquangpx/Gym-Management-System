import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Grid, TextField, Button,
  MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function EditGymRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gymRoom, setGymRoom] = useState({
    name: '',
    roomType: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchGymRoom();
    } else {
      setLoading(false);
    }
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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch gym room');
      }
      
      const data = await response.json();
      setGymRoom(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gym room:', error);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
      
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGymRoom(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
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
        body: JSON.stringify(gymRoom),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update gym room');
      }
      
      alert('Phòng tập đã được cập nhật thành công!');
      navigate('/admin/gymrooms');
    } catch (error) {
      console.error('Error updating gym room:', error);
      alert('Lỗi khi cập nhật phòng tập: ' + error.message);
      
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
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/gymrooms')}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Lưu thay đổi
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          Chỉnh sửa phòng tập
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên phòng tập"
                name="name"
                value={gymRoom.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Loại phòng</InputLabel>
                <Select
                  name="roomType"
                  value={gymRoom.roomType}
                  onChange={handleChange}
                  label="Loại phòng"
                  required
                >
                  <MenuItem value="cardio">Cardio</MenuItem>
                  <MenuItem value="strength">Tập sức mạnh</MenuItem>
                  <MenuItem value="yoga">Yoga</MenuItem>
                  <MenuItem value="functional">Tập chức năng</MenuItem>
                  <MenuItem value="group">Tập nhóm</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={gymRoom.status}
                  onChange={handleChange}
                  label="Trạng thái"
                  required
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="maintenance">Bảo trì</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
} 