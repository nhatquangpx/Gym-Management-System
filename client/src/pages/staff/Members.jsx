import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import axios from '../../utils/axiosConfig';

export default function StaffMembers() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({ name: '', phone: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/members');
      setMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      setError('Không thể tải danh sách hội viên. Vui lòng thử lại sau.');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hội viên này?')) {
      try {
        await axios.delete(`/api/members/${id}`);
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Không thể xóa hội viên. Vui lòng thử lại sau.');
      }
    }
  };

  const filteredMembers = members.filter(m =>
    (filter.name === '' || (m.name && m.name.toLowerCase().includes(filter.name.toLowerCase()))) &&
    (filter.phone === '' || (m.phone && m.phone.includes(filter.phone)))
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
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: 'error.main' }}>
                  {error}
                </TableCell>
              </TableRow>
            ) : filteredMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ color: 'var(--admin-text)' }}>
                  Không có hội viên nào
                </TableCell>
              </TableRow>
            ) : (
              filteredMembers.map(m => (
                <TableRow key={m._id} className="hover:bg-[var(--admin-accent)]">
                  <TableCell sx={{ color: 'var(--admin-text)' }}>{m.name}</TableCell>
                  <TableCell sx={{ color: 'var(--admin-text)' }}>{m.phone}</TableCell>
                  <TableCell sx={{ color: 'var(--admin-text)' }}>{m.email}</TableCell>
                  <TableCell sx={{ color: 'var(--admin-text)' }}>
                    {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ''}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => navigate(`/staff/members/${m._id}`)} sx={{ color: 'var(--admin-primary)' }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton onClick={() => navigate(`/staff/members/edit/${m._id}`)} sx={{ color: 'var(--admin-text)' }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(m._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 