import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Typography, Box, Chip, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions,
  Tooltip, TextField, MenuItem, Select, InputLabel, FormControl, Checkbox
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';

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
  const [selectedEquipments, setSelectedEquipments] = useState([]);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [emailDetails, setEmailDetails] = useState({});
  const [isBulkEmail, setIsBulkEmail] = useState(false);
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

  const handleSendMaintenanceEmail = async (equipmentId, details) => {
    try {
      const response = await fetch('http://localhost:8001/api/equipments/maintenance-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          equipmentId,
          issueDetails: details
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send maintenance email');
      }

      alert('Đã gửi email thông báo bảo trì thành công!');
      setOpenEmailDialog(false);
      setEmailDetails({});
    } catch (error) {
      console.error('Error sending maintenance email:', error);
      alert('Lỗi khi gửi email thông báo bảo trì: ' + error.message);
    }
  };

  const handleSendBulkMaintenanceEmail = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/equipments/bulk-maintenance-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          equipmentIds: selectedEquipments,
          issueDetails: emailDetails
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send bulk maintenance email');
      }

      alert('Đã gửi email thông báo bảo trì hàng loạt thành công!');
      setOpenEmailDialog(false);
      setEmailDetails({});
      setSelectedEquipments([]);
      setIsBulkEmail(false);
    } catch (error) {
      console.error('Error sending bulk maintenance email:', error);
      alert('Lỗi khi gửi email thông báo bảo trì hàng loạt: ' + error.message);
    }
  };

  const handleEmailClick = (equipment) => {
    if (equipment.status === 'maintenance' || equipment.status === 'inactive') {
      setEmailDetails({ [equipment._id]: '' });
      setIsBulkEmail(false);
      setOpenEmailDialog(true);
    } else {
      alert('Chỉ có thể gửi email thông báo bảo trì cho thiết bị đang bảo trì hoặc không hoạt động');
    }
  };

  const handleBulkEmailClick = () => {
    const maintenanceEquipments = equipment.filter(eq => 
      (eq.status === 'maintenance' || eq.status === 'inactive') && 
      selectedEquipments.includes(eq._id)
    );

    if (maintenanceEquipments.length === 0) {
      alert('Vui lòng chọn ít nhất một thiết bị đang bảo trì hoặc không hoạt động');
      return;
    }

    setEmailDetails(
      maintenanceEquipments.reduce((acc, eq) => ({
        ...acc,
        [eq._id]: ''
      }), {})
    );
    setIsBulkEmail(true);
    setOpenEmailDialog(true);
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
          <Box className="flex gap-2">
            {selectedEquipments.length > 0 && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<EmailIcon />}
                onClick={handleBulkEmailClick}
              >
                Gửi email bảo trì
              </Button>
            )}
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

        <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-2xl">
              <thead>
                <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                  <th className="py-3 px-4 text-left">Tên thiết bị</th>
                  <th className="py-3 px-4 text-left">Phòng tập</th>
                  <th className="py-3 px-4 text-left">Mô tả</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-center"></th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-4">Không có thiết bị nào</td></tr>
                ) : filteredEquipment.map((item) => (
                  <tr key={item._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                    <td className="px-6 py-4 text-[var(--admin-text)] text-left">{item.name}</td>
                    <td className="px-6 py-4 text-[var(--admin-text)] text-left">
                      {item.roomId && item.roomId.name ? (
                        <Tooltip title={`Loại phòng: ${item.roomId.roomType || 'Không xác định'}`}> <span>{item.roomId.name}</span> </Tooltip>
                      ) : 'Không xác định'}
                    </td>
                    <td className="px-6 py-4 text-[var(--admin-text)] text-left">
                      <Tooltip title={item.description || ''}>
                        <span>{item.description ? (item.description.length > 30 ? item.description.substring(0, 30) + '...' : item.description) : ''}</span>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 text-[var(--admin-text)] text-left">
                      <Chip
                        label={item.status === 'active' ? 'Hoạt động' : 
                               item.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'}
                        color={item.status === 'active' ? 'success' : 
                               item.status === 'maintenance' ? 'warning' : 'error'}
                        size="small"
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      {(item.status === 'maintenance' || item.status === 'inactive') ? (
                        <Checkbox
                          checked={selectedEquipments.includes(item._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedEquipments([...selectedEquipments, item._id]);
                            } else {
                              setSelectedEquipments(selectedEquipments.filter(id => id !== item._id));
                            }
                          }}
                        />
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <IconButton
                          component={Link}
                          to={`/staff/equipment/view/${item._id}`}
                          sx={{ color: 'var(--admin-primary)' }} 
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton
                          component={Link}
                          to={`/staff/equipment/edit/${item._id}`}
                          sx={{ color: 'var(--admin-text)' }} 
                        >
                          <EditIcon />
                        </IconButton>
                        {(item.status === 'maintenance' || item.status === 'inactive') && (
                          <Tooltip title="Gửi email bảo trì">
                            <IconButton
                              onClick={() => handleEmailClick(item)}
                              sx={{ color: 'var(--admin-primary)' }}
                            >
                              <EmailIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                        <IconButton
                          sx={{ color: '#d32f2f' }}
                          onClick={() => handleDelete(item._id)}
                        >
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

        <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {isBulkEmail ? 'Gửi email thông báo bảo trì hàng loạt' : 'Gửi email thông báo bảo trì'}
          </DialogTitle>
          <DialogContent>
            {isBulkEmail ? (
              <Box className="mt-4">
                {equipment
                  .filter(eq => selectedEquipments.includes(eq._id))
                  .map(eq => (
                    <Box key={eq._id} className="mb-4">
                      <Typography variant="subtitle1" className="mb-2">
                        {eq.name}
                      </Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Chi tiết sự cố"
                        value={emailDetails[eq._id] || ''}
                        onChange={(e) => setEmailDetails({
                          ...emailDetails,
                          [eq._id]: e.target.value
                        })}
                      />
                    </Box>
                  ))
                }
              </Box>
            ) : (
              <Box className="mt-4">
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Chi tiết sự cố"
                  value={Object.values(emailDetails)[0] || ''}
                  onChange={(e) => setEmailDetails({
                    [Object.keys(emailDetails)[0]]: e.target.value
                  })}
                />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEmailDialog(false)}>Hủy</Button>
            <Button 
              onClick={() => isBulkEmail ? handleSendBulkMaintenanceEmail() : handleSendMaintenanceEmail(Object.keys(emailDetails)[0], Object.values(emailDetails)[0])}
              variant="contained" 
              color="primary"
            >
              Gửi email
            </Button>
          </DialogActions>
        </Dialog>

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