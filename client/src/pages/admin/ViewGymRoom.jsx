import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Button, Chip, Grid, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export default function ViewGymRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [gymRoom, setGymRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [equipments, setEquipments] = useState([]);
  const [loadingEquipments, setLoadingEquipments] = useState(true);

  useEffect(() => {
    fetchGymRoom();
    fetchEquipments();
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
    } catch (error) {
      console.error('Error fetching gym room:', error);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipments = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      
      const response = await fetch('http://localhost:8001/api/equipments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch equipment');
      }
      
      const data = await response.json();
      // Lọc thiết bị theo phòng tập
      const roomEquipments = data.filter(eq => eq.roomId && eq.roomId._id === id);
      setEquipments(roomEquipments);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    } finally {
      setLoadingEquipments(false);
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

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'success';
      case 'maintenance': return 'warning';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!gymRoom) {
    return <div className="p-6">Không tìm thấy phòng tập</div>;
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
          startIcon={<EditIcon />}
          onClick={() => navigate(`/admin/gymrooms/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          {gymRoom.name}
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" className="font-medium text-gray-600">
              Loại phòng:
            </Typography>
            <Typography variant="body1" className="mb-4">
              {getRoomTypeLabel(gymRoom.roomType)}
            </Typography>

            <Typography variant="subtitle1" className="font-medium text-gray-600">
              Trạng thái:
            </Typography>
            <Chip 
              label={getStatusLabel(gymRoom.status)}
              color={getStatusColor(gymRoom.status)}
              className="mb-4"
            />

            <Typography variant="subtitle1" className="font-medium text-gray-600">
              Ngày tạo:
            </Typography>
            <Typography variant="body1" className="mb-4">
              {new Date(gymRoom.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>

            <Typography variant="subtitle1" className="font-medium text-gray-600">
              Cập nhật lần cuối:
            </Typography>
            <Typography variant="body1" className="mb-4">
              {new Date(gymRoom.updatedAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h5" className="font-bold text-gray-800 mb-4">
          Danh sách thiết bị trong phòng
        </Typography>
        <Divider className="mb-4" />

        {loadingEquipments ? (
          <Typography>Đang tải danh sách thiết bị...</Typography>
        ) : equipments.length === 0 ? (
          <Typography>Chưa có thiết bị nào trong phòng này</Typography>
        ) : (
          <Grid container spacing={2}>
            {equipments.map(equipment => (
              <Grid item xs={12} sm={6} md={4} key={equipment._id}>
                <Paper className="p-4 h-full" elevation={3}>
                  <Typography variant="h6" className="font-bold">
                    {equipment.name}
                  </Typography>
                  <Typography variant="body2" className="text-gray-600 mb-2">
                    {equipment.description}
                  </Typography>
                  <Chip 
                    label={
                      equipment.status === 'active' ? 'Hoạt động' : 
                      equipment.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'
                    }
                    color={
                      equipment.status === 'active' ? 'success' : 
                      equipment.status === 'maintenance' ? 'warning' : 'error'
                    }
                    size="small"
                  />
                  <Box className="mt-2">
                    <Button 
                      size="small" 
                      color="primary"
                      onClick={() => navigate(`/admin/equipment/view/${equipment._id}`)}
                    >
                      Xem chi tiết
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </div>
  );
} 