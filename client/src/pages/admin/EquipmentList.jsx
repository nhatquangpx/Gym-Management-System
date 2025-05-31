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

export default function EquipmentList() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', description: '', status: '', roomId: '' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
    fetchEquipment();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/gymrooms');
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
      const res = await fetch('http://localhost:8001/api/equipments');
      if (!res.ok) {
        throw new Error('Failed to fetch equipment');
      }
      const data = await res.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
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

      const response = await fetch(`http://localhost:8001/api/equipments/${itemToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete equipment');
      }
      
      fetchEquipment();
      alert('Xóa thiết bị thành công!');
    } catch (error) {
      console.error('Error deleting equipment:', error);
      alert('Lỗi khi xóa thiết bị: ' + error.message);
    } finally {
      setOpenConfirm(false);
      setItemToDelete(null);
    }
  };

  const filteredEquipment = equipment.filter(eq =>
    (filter.name === '' || (eq.name && eq.name.toLowerCase().includes(filter.name.toLowerCase()))) &&
    (filter.description === '' || (eq.description && eq.description.toLowerCase().includes(filter.description.toLowerCase()))) &&
    (filter.status === '' || eq.status === filter.status) &&
    (filter.roomId === '' || (eq.roomId && eq.roomId._id === filter.roomId))
  );

  return (
    <div className="p-6">
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
          Danh sách thiết bị
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/equipment/add')}
        >
          Thêm thiết bị
        </Button>
      </Box>
      <Paper className="p-4 mb-4">
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Tìm theo tên"
            value={filter.name}
            onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
            size="small"
          />
          <TextField
            label="Tìm theo mô tả"
            value={filter.description}
            onChange={e => setFilter(f => ({ ...f, description: e.target.value }))}
            size="small"
          />
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filter.status}
              label="Trạng thái"
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Hoạt động</MenuItem>
              <MenuItem value="maintenance">Bảo trì</MenuItem>
              <MenuItem value="inactive">Không hoạt động</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Phòng tập</InputLabel>
            <Select
              value={filter.roomId}
              label="Phòng tập"
              onChange={e => setFilter(f => ({ ...f, roomId: e.target.value }))}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {rooms.map(room => (
                <MenuItem key={room._id} value={room._id}>{room.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Tên thiết bị</th>
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Phòng tập</th>
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Mô tả</th>
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Trạng thái</th>
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-4 px-6 text-base text-center">Đang tải...</td></tr>
              ) : filteredEquipment.length === 0 ? (
                <tr><td colSpan={5} className="py-4 px-6 text-base text-center">Không có thiết bị nào</td></tr>
              ) : filteredEquipment.map(eq => (
                <tr key={eq._id}>
                  <td className="py-4 px-6 text-[var(--admin-text)] text-base text-center">{eq.name}</td>
                  <td className="py-4 px-6 text-[var(--admin-text)] text-base text-center">
                    {eq.roomId && eq.roomId.name ? (
                      <Tooltip title={`Loại phòng: ${eq.roomId.roomType || 'Không xác định'}`}>
                        <span>{eq.roomId.name}</span>
                      </Tooltip>
                    ) : (
                      'Không xác định'
                    )}
                  </td>
                  <td className="py-4 px-6 text-[var(--admin-text)] text-base text-center">
                    <Tooltip title={eq.description || ''}>
                      <span>{eq.description ? (eq.description.length > 30 ? eq.description.substring(0, 30) + '...' : eq.description) : ''}</span>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-6 text-[var(--admin-text)] text-base text-center">
                    <Chip
                      label={eq.status === 'active' ? 'Hoạt động' : 
                             eq.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'}
                      color={eq.status === 'active' ? 'success' : 
                             eq.status === 'maintenance' ? 'warning' : 'error'}
                      size="small"
                    />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => navigate(`/admin/equipment/view/${eq._id}`)}><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => navigate(`/admin/equipment/edit/${eq._id}`)}><EditIcon /></IconButton>
                    <IconButton sx={{ color: 'red' }} onClick={() => handleDelete(eq._id)}><DeleteIcon /></IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa thiết bị này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 