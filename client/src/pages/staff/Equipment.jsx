import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Typography, Box, Chip, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f8cff',
    },
  },
});

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filter, setFilter] = useState({ name: '', description: '', status: '', roomId: '' });
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

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
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
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
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete equipment');
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
    } finally {
      setOpenConfirm(false);
      setItemToDelete(null);
    }
  };

  const filteredEquipment = equipment.filter(eq =>
    (filter.name === '' || eq.name.toLowerCase().includes(filter.name.toLowerCase())) &&
    (filter.description === '' || (eq.description && eq.description.toLowerCase().includes(filter.description.toLowerCase()))) &&
    (filter.status === '' || eq.status === filter.status) &&
    (filter.roomId === '' || (eq.roomId && eq.roomId._id === filter.roomId))
  );

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
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
            component={Link}
            to="/staff/equipment/add"
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
                  <MenuItem key={room._id} value={room._id}>
                    {room.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Tên thiết bị</TableCell>
                <TableCell>Phòng tập</TableCell>
                <TableCell>Mô tả</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEquipment.length === 0 ? (
                <TableRow><TableCell colSpan={5} align="center">Không có thiết bị nào</TableCell></TableRow>
              ) : filteredEquipment.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>
                    {item.roomId && item.roomId.name ? (
                      <Tooltip title={`Loại phòng: ${item.roomId.roomType || 'Không xác định'}`}>
                        <span>{item.roomId.name}</span>
                      </Tooltip>
                    ) : (
                      'Không xác định'
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={item.description || ''}>
                      <span>{item.description ? (item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description) : ''}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={item.status === 'active' ? 'Hoạt động' : 
                             item.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'}
                      color={item.status === 'active' ? 'success' : 
                             item.status === 'maintenance' ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/staff/equipment/view/${item._id}`}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/staff/equipment/edit/${item._id}`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn xóa thiết bị này?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
            <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
} 