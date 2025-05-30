import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Button, Chip, Divider, ThemeProvider, createTheme,
  Alert, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f8cff',
    },
  },
});

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
      <div className="p-6 flex justify-center items-center">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="p-6">
        <Alert severity="info">Không tìm thấy thiết bị.</Alert>
      </div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="p-6">
        <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto">
          <Box className="flex justify-between items-center mb-6">
            <Typography 
              variant="h4" 
              className="font-bold"
              sx={{ 
                color: '#4f8cff', 
                fontWeight: 700, 
                fontSize: '2.2em'
              }}
            >
              Chi tiết thiết bị
            </Typography>
            <Chip 
              label={getStatusLabel(equipment.status)} 
              color={getStatusColor(equipment.status)} 
            />
          </Box>
          
          <Divider className="my-4" />
          
          <Box className="space-y-4">
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Tên thiết bị</Typography>
              <Typography variant="h6">{equipment.name}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Phòng tập</Typography>
              <Typography variant="body1">
                {equipment.roomId ? equipment.roomId.name : 'Không xác định'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Ngày mua</Typography>
              <Typography variant="body1">
                {equipment.purchaseDate 
                  ? new Date(equipment.purchaseDate).toLocaleDateString() 
                  : 'Chưa có thông tin'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Ngày hết hạn bảo hành</Typography>
              <Typography variant="body1">
                {equipment.warrantyDate 
                  ? new Date(equipment.warrantyDate).toLocaleDateString() 
                  : 'Chưa có thông tin'}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Mô tả</Typography>
              <Typography variant="body1">
                {equipment.description || 'Không có mô tả'}
              </Typography>
            </Box>
          </Box>
          
          <Box className="flex gap-4 mt-8">
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/staff/equipment/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/staff/equipment')}
            >
              Quay lại
            </Button>
          </Box>
        </Paper>
      </div>
    </ThemeProvider>
  );
} 