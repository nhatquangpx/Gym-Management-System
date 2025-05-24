import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function EquipmentList() {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', type: '', status: '' });

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
    if (window.confirm('Bạn có chắc chắn muốn xóa thiết bị này?')) {
      try {
        await fetch(`/api/equipment/${id}`, { method: 'DELETE' });
        fetchEquipment();
      } catch (error) {
        console.error('Error deleting equipment:', error);
      }
    }
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
          color="primary"
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên thiết bị</TableCell>
              <TableCell>Loại</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Ngày bảo trì gần nhất</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5}>Loading...</TableCell></TableRow>
            ) : filteredEquipment.length === 0 ? (
              <TableRow><TableCell colSpan={5}>Không có thiết bị nào</TableCell></TableRow>
            ) : filteredEquipment.map(eq => (
              <TableRow key={eq._id}>
                <TableCell>{eq.name}</TableCell>
                <TableCell>{eq.type}</TableCell>
                <TableCell>{
                  eq.status === 'active' ? 'Hoạt động' :
                  eq.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'
                }</TableCell>
                <TableCell>{eq.maintenanceDate ? new Date(eq.maintenanceDate).toLocaleDateString() : ''}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/admin/equipment/${eq._id}`)}><VisibilityIcon /></IconButton>
                  <IconButton onClick={() => navigate(`/admin/equipment/edit/${eq._id}`)}><EditIcon /></IconButton>
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