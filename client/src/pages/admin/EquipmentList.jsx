import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function EquipmentList() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([
    {
      _id: 1,
      name: 'Máy chạy bộ TechnoGym',
      type: 'Cardio',
      status: 'active',
      maintenanceDate: '2024-06-01',
    },
    {
      _id: 2,
      name: 'Ghế đẩy ngực Impulse',
      type: 'Strength',
      status: 'maintenance',
      maintenanceDate: '2024-05-20',
    },
    {
      _id: 3,
      name: 'Xe đạp tập Life Fitness',
      type: 'Cardio',
      status: 'inactive',
      maintenanceDate: '2024-04-15',
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', type: '', status: '' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/equipment');
      const data = await res.json();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`/api/equipment/${itemToDelete}`, {
        method: 'DELETE',
      });
      fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
    setOpenConfirm(false);
    setItemToDelete(null);
  };

  const filteredEquipment = equipment.filter(eq =>
    (filter.name === '' || eq.name.toLowerCase().includes(filter.name.toLowerCase())) &&
    (filter.type === '' || eq.type === filter.type) &&
    (filter.status === '' || eq.status === filter.status)
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
            label="Loại thiết bị"
            value={filter.type}
            onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
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
        </Box>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Tên thiết bị</th>
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Loại</th>
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Trạng thái</th>
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Ngày bảo trì gần nhất</th>
                <th className="py-4 px-6 text-center text-[var(--admin-primary)] font-bold text-base">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-4 px-6 text-base">Loading...</td></tr>
              ) : filteredEquipment.length === 0 ? (
                <tr><td colSpan={5} className="py-4 px-6 text-base">Không có thiết bị nào</td></tr>
              ) : filteredEquipment.map(eq => (
                <tr key={eq._id}>
                  <td className="py-4 px-6 text-[var(--admin-text)] text-base text-center">{eq.name}</td>
                  <td className="py-4 px-6 text-[var(--admin-text)] text-base text-center">{eq.type}</td>
                  <td className="py-4 px-6 text-[var(--admin-text)] text-base text-center">{
                    eq.status === 'active' ? 'Hoạt động' :
                    eq.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'
                  }</td>
                  <td className="py-4 px-6 text-[var(--admin-text)] text-base text-center">{eq.maintenanceDate ? new Date(eq.maintenanceDate).toLocaleDateString() : ''}</td>
                  <td className="py-4 px-6 text-center">
                    <IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => navigate(`/admin/equipment/view/${eq._id}`)}><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => navigate(`/admin/equipment/edit/${eq._id}`)}><EditIcon /></IconButton>
                    <IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => handleDelete(eq._id)}><DeleteIcon /></IconButton>
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