import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, Alert, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import GroupIcon from '@mui/icons-material/Group';
import axios from '../../utils/axiosConfig';

export default function StaffMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ name: '', phone: '', email: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/members');
      
      // Format data to match UI requirements
      const formattedMembers = response.data.data.map(member => ({
        id: member._id,
        name: member.name || `${member.firstName || ''} ${member.lastName || ''}`,
        email: member.email,
        phone: member.phone || 'Chưa cập nhật',
        status: member.isActive !== false ? 'Đang hoạt động' : 'Tạm dừng',
        joinDate: formatDate(member.createdAt)
      }));
      
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Failed to load members. Please try again later.');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/members/${itemToDelete}`);
      
      setSnackbar({
        open: true,
        message: 'Member deleted successfully',
        severity: 'success'
      });
      
      // Update list after deletion
      setMembers(members.filter(member => member.id !== itemToDelete));
      setOpenConfirm(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting member:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete member',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(filter.name.toLowerCase()) &&
    member.phone.includes(filter.phone) &&
    member.email.toLowerCase().includes(filter.email.toLowerCase())
  );

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
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
          Danh sách hội viên
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': { backgroundColor: 'var(--admin-primary-dark)' }
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/staff/members/add')}
        >
          Thêm hội viên
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
          <TextField
            label="Số điện thoại"
            value={filter.phone}
            onChange={e => setFilter(f => ({ ...f, phone: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Email"
            value={filter.email}
            onChange={e => setFilter(f => ({ ...f, email: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ background: 'var(--admin-sidebar)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'var(--admin-header)' }}>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Tên hội viên</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Số điện thoại</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Email</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Ngày đăng ký</TableCell>
              <TableCell align="right" sx={{ color: 'var(--admin-primary)' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: 'var(--admin-text)' }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: 'var(--admin-text)' }}>
                  Không có hội viên nào
                </TableCell>
              </TableRow>
            ) : filteredMembers.map(member => (
              <TableRow key={member.id} className="hover:bg-[var(--admin-accent)]">
                <TableCell sx={{ color: 'var(--admin-text)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupIcon sx={{ color: 'var(--admin-primary)' }} />
                    {member.name}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{member.phone}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{member.email}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{member.joinDate}</TableCell>
                <TableCell align="right">
                  <IconButton 
                    onClick={() => navigate(`/staff/members/view/${member.id}`)} 
                    sx={{ color: 'var(--admin-primary)' }}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    onClick={() => navigate(`/staff/members/edit/${member.id}`)} 
                    sx={{ color: 'var(--admin-text)' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(member.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa thành viên này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 