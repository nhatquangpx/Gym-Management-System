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

      <Paper sx={{ p: 2, mb: 3, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Tìm theo tên"
            value={filter.name}
            onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />
          <TextField
            label="Số điện thoại"
            value={filter.phone}
            onChange={e => setFilter(f => ({ ...f, phone: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />
          <TextField
            label="Email"
            value={filter.email}
            onChange={e => setFilter(f => ({ ...f, email: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />
        </Box>
      </Paper>

      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-left">Tên hội viên</th>
                <th className="py-3 px-4 text-left">Số điện thoại</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Ngày đăng ký</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Loading...</td>
                </tr>
              ) : filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">Không có hội viên nào</td>
                </tr>
              ) : filteredMembers.map(member => (
                <tr key={member.id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">
                    <span className="flex items-center gap-2 justify-start">
                      <GroupIcon className="text-[var(--admin-primary)]" style={{ fontSize: 22 }} />
                      {member.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{member.phone}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{member.email}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{member.joinDate}</td>
                  <td className="px-6 py-4 text-center">
                    <IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => navigate(`/staff/members/view/${member.id}`)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton sx={{ color: 'var(--admin-text)' }} onClick={() => navigate(`/staff/members/edit/${member.id}`)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton sx={{ color: '#d32f2f' }} onClick={() => handleDelete(member.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>

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