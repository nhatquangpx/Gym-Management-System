import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, Button, Chip, Divider } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export default function ViewEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/auth/login'), 2000);
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
      setEquipment(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Không thể tải thông tin thiết bị: ' + error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } finally {
      setLoading(false);
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
    return (
      <div className="p-6">
        <Typography>Đang tải...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="p-6">
        <Typography>Không tìm thấy thiết bị.</Typography>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto" style={{ background: '#232323' }}>
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold text-white">
            Chi tiết thiết bị
          </Typography>
          <Chip 
            label={getStatusLabel(equipment.status)} 
            color={getStatusColor(equipment.status)} 
          />
        </Box>
        
        <Divider className="my-4" sx={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
        
        <Box className="space-y-4 text-white">
          <Box>
            <Typography variant="subtitle2" color="gray">Tên thiết bị</Typography>
            <Typography variant="h6">{equipment.name}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="gray">Loại thiết bị</Typography>
            <Typography variant="body1">{equipment.type}</Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="gray">Ngày bảo trì gần nhất</Typography>
            <Typography variant="body1">
              {equipment.maintenanceDate 
                ? new Date(equipment.maintenanceDate).toLocaleDateString() 
                : 'Chưa có thông tin'}
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" color="gray">Ghi chú bảo trì</Typography>
            <Typography variant="body1">
              {equipment.maintenanceNotes || 'Không có ghi chú'}
            </Typography>
          </Box>
        </Box>
        
        <Box className="flex gap-4 mt-8">
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/staff/equipment/edit/${id}`)}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/staff/equipment')}
            sx={{ color: 'white', borderColor: 'white' }}
          >
            Quay lại
          </Button>
        </Box>
      </Paper>
    </div>
  );
} 