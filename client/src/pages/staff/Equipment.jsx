import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddButton from '../../components/AddButton';
import AddIcon from '@mui/icons-material/Add';

export default function StaffEquipment() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', description: '', status: '', roomId: '' });
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchEquipment();
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

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const res = await fetch('http://localhost:8001/api/equipments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Không thể tải danh sách thiết bị');
      }
      
      const data = await res.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      alert('Lỗi khi tải danh sách thiết bị: ' + error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          navigate('/auth/login');
          return;
        }
        
        const response = await fetch(`http://localhost:8001/api/equipments/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Không thể xóa thiết bị');
        }
        
        alert('Xóa thiết bị thành công!');
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
        alert('Lỗi khi xóa thiết bị: ' + error.message);
        
        if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/auth/login');
        }
      }
    }
  };

  const filteredEquipment = equipment.filter(eq =>
    (filter.name === '' || eq.name.toLowerCase().includes(filter.name.toLowerCase())) &&
    (filter.description === '' || (eq.description && eq.description.toLowerCase().includes(filter.description.toLowerCase()))) &&
    (filter.status === '' || eq.status === filter.status) &&
    (filter.roomId === '' || (eq.roomId && eq.roomId._id === filter.roomId))
  );

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
      <Box className="flex justify-between items-center mb-6">
        <Typography
          variant="h4"
          className="font-bold"
          sx={{
            color: '#4f8cff',
            fontWeight: 700,
            fontSize: '2.2em',
            mb: 4
          }}
        >
          Quản lý thiết bị
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': { backgroundColor: 'var(--admin-primary-dark)' }
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/staff/equipment/add')}
        >
          Thêm thiết bị
        </Button>
      </Box>
      <Paper className="p-4 mb-4" sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Tìm theo tên"
            value={filter.name}
            onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            label="Tìm theo mô tả"
            value={filter.description}
            onChange={e => setFilter(f => ({ ...f, description: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
            <Select
              value={filter.status}
              label="Trạng thái"
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              sx={{ color: 'var(--admin-text)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }, '.MuiSvgIcon-root': { color: 'var(--admin-text)' } }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="maintenance">Bảo trì</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Phòng tập</InputLabel>
            <Select
              value={filter.roomId}
              label="Phòng tập"
              onChange={e => setFilter(f => ({ ...f, roomId: e.target.value }))}
              sx={{ color: 'var(--admin-text)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }, '.MuiSvgIcon-root': { color: 'var(--admin-text)' } }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {rooms.map(room => (
                <MenuItem key={room._id} value={room._id}>{room.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <TableContainer component={Paper} sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'var(--admin-header)' }}>
            <TableRow>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Tên thiết bị</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Phòng tập</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Mô tả</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Trạng thái</TableCell>
              <TableCell align="right" sx={{ color: 'var(--admin-text)' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} sx={{ color: 'var(--admin-text)' }}>Loading...</TableCell></TableRow>
            ) : filteredEquipment.length === 0 ? (
              <TableRow><TableCell colSpan={5} sx={{ color: 'var(--admin-text)' }}>Không có thiết bị nào</TableCell></TableRow>
            ) : filteredEquipment.map(eq => (
              <TableRow key={eq._id}>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{eq.name}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>
                  {eq.roomId && eq.roomId.name ? (
                    <Tooltip title={`Loại phòng: ${eq.roomId.roomType || 'Không xác định'}`}>
                      <span>{eq.roomId.name}</span>
                    </Tooltip>
                  ) : (
                    'Không xác định'
                  )}
                </TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>
                  <Tooltip title={eq.description || ''}>
                    <span>{eq.description ? (eq.description.length > 30 ? eq.description.substring(0, 30) + '...' : eq.description) : ''}</span>
                  </Tooltip>
                </TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{
                  eq.status === 'active' ? 'Hoạt động' :
                  eq.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'
                }</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/staff/equipment/${eq._id}`)} sx={{ color: 'var(--admin-text)' }}><VisibilityIcon /></IconButton>
                  <IconButton onClick={() => navigate(`/staff/equipment/edit/${eq._id}`)} sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(eq._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 