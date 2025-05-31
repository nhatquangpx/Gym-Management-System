import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function GymRoomList() {
  const navigate = useNavigate();
  const [gymRooms, setGymRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', roomType: '', status: '' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchGymRooms();
  }, []);

  const fetchGymRooms = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }

      const res = await fetch('http://localhost:8001/api/gymrooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error('Failed to fetch gym rooms');
      }
      const data = await res.json();
      setGymRooms(data);
    } catch (error) {
      console.error('Error fetching gym rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }

      const response = await fetch(`http://localhost:8001/api/gymrooms/${itemToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gym room');
      }
      
      fetchGymRooms();
      alert('Xóa phòng tập thành công!');
    } catch (error) {
      console.error('Error deleting gym room:', error);
      alert('Lỗi khi xóa phòng tập: ' + error.message);
    } finally {
      setOpenConfirm(false);
      setItemToDelete(null);
    }
  };

  const filteredGymRooms = gymRooms.filter(room =>
    (filter.name === '' || (room.name && room.name.toLowerCase().includes(filter.name.toLowerCase()))) &&
    (filter.roomType === '' || room.roomType === filter.roomType) &&
    (filter.status === '' || room.status === filter.status)
  );

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

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography
          variant="h4"
          className="font-bold"
          sx={{
            color: 'var(--admin-primary)',
            fontWeight: 700,
            fontSize: '2.2em',
            mb: 4
          }}
        >
          Danh sách phòng tập
        </Typography>
        <Button
          variant="contained"
          sx={{ 
              backgroundColor: 'var(--admin-primary)',
              color: 'white',
              '&:hover': { backgroundColor: 'var(--admin-primary-dark)', opacity: 0.9 }
            }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/gymrooms/add')}
        >
          Thêm phòng tập
        </Button>
      </Box>
      <Paper className="p-4 mb-4" sx={{ background: 'var(--admin-sidebar)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Tìm theo tên"
            value={filter.name}
            onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Loại phòng</InputLabel>
            <Select
              value={filter.roomType}
              label="Loại phòng"
              onChange={e => setFilter(f => ({ ...f, roomType: e.target.value }))}
              sx={{ color: 'var(--admin-text)' }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="cardio">Cardio</MenuItem>
              <MenuItem value="strength">Tập sức mạnh</MenuItem>
              <MenuItem value="yoga">Yoga</MenuItem>
              <MenuItem value="functional">Tập chức năng</MenuItem>
              <MenuItem value="group">Tập nhóm</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
            <Select
              value={filter.status}
              label="Trạng thái"
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              sx={{ color: 'var(--admin-text)' }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="maintenance">Bảo trì</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Tên phòng</th>
                <th className="py-3 px-4 text-center">Loại phòng</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-4 px-6 text-base text-center text-[var(--admin-text)]">Đang tải...</td></tr>
              ) : filteredGymRooms.length === 0 ? (
                <tr><td colSpan={4} className="py-4 px-6 text-base text-center text-[var(--admin-text)]">Không có phòng tập nào</td></tr>
              ) : filteredGymRooms.map(room => (
                <tr key={room._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{room.name}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{getRoomTypeLabel(room.roomType)}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    <Chip
                      label={room.status === 'active' ? 'Hoạt động' : 
                             room.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'}
                      color={room.status === 'active' ? 'success' : 
                             room.status === 'maintenance' ? 'warning' : 'error'}
                      size="small"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => navigate(`/admin/gymrooms/view/${room._id}`)}>
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton sx={{ color: 'var(--admin-text)' }} onClick={() => navigate(`/admin/gymrooms/edit/${room._id}`)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => handleDelete(room._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ color: 'var(--admin-primary)' }}>Xác nhận xóa</DialogTitle>
        <DialogContent sx={{ color: 'var(--admin-text)' }}>Bạn có chắc chắn muốn xóa phòng tập này?</DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 