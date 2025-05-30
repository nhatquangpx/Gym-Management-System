import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip
} from '@mui/material';
import axios from 'axios';

const ViewGymRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [room, setRoom] = useState(null);
  const [equipment, setEquipment] = useState([]);

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
        setRoom(response.data);

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

  if (!room) {
    return (
      <div className="bg-white min-h-screen p-6">
        <div className="text-center text-[#333]">Không tìm thấy phòng tập</div>
      </div>
    );
  }

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

  return (
    <div className="bg-white min-h-screen p-6">
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#1a237e' }}>
        Chi tiết phòng tập
      </Typography>

      <Paper className="bg-white p-6 max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <Typography variant="h6" className="font-semibold mb-2" sx={{ color: '#1a237e' }}>Tên phòng</Typography>
            <Typography sx={{ color: '#333' }}>{room.name}</Typography>
          </div>

          <div>
            <Typography variant="h6" className="font-semibold mb-2" sx={{ color: '#1a237e' }}>Trạng thái</Typography>
            <Chip
              label={getStatusLabel(room.status)}
              color={room.status === 'active' ? 'success' : 
                     room.status === 'maintenance' ? 'warning' : 'error'}
              size="small"
            />
          </div>

          <div>
            <Typography variant="h6" className="font-semibold mb-2" sx={{ color: '#1a237e' }}>Loại phòng</Typography>
            <Typography sx={{ color: '#333' }}>{getRoomTypeLabel(room.roomType)}</Typography>
          </div>

          <div>
            <Typography variant="h6" className="font-semibold mb-2" sx={{ color: '#1a237e' }}>Thiết bị trong phòng</Typography>
            {equipment.length === 0 ? (
              <Typography sx={{ color: '#333' }}>Chưa có thiết bị nào</Typography>
            ) : (
              <List>
                {equipment.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <ListItem>
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
        </div>

        <Box className="flex gap-3 mt-6">
          <Button 
            variant="contained"
            onClick={() => navigate(`/admin/gymrooms/edit/${id}`)}
            sx={{ 
              backgroundColor: 'var(--admin-primary)',
              '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
            }}
          >
            Chỉnh sửa
          </Button>
          <Button 
            variant="outlined"
            onClick={() => navigate('/admin/gymrooms')}
            sx={{ 
              color: 'var(--admin-primary)', 
              borderColor: 'var(--admin-primary)',
              '&:hover': {
                borderColor: 'var(--admin-primary)',
                backgroundColor: 'rgba(26, 35, 126, 0.04)'
              }
            }}
          >
            Quay lại
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default ViewGymRoom; 