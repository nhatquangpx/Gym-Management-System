import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, Chip, Rating, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function StaffFeedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ 
    member: '', 
    type: '',
    targetName: ''
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/feedbacks', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await res.json();
      setFeedback(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setFeedback([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      try {
        await fetch(`/api/feedbacks/${id}`, { 
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        fetchFeedback();
        alert('Phản hồi đã được xóa thành công');
      } catch (error) {
        console.error('Error deleting feedback:', error);
        alert('Lỗi khi xóa phản hồi');
      }
    }
  };

  const filteredFeedback = Array.isArray(feedback) ? feedback.filter(fb =>
    (filter.member === '' || (fb.memberName && fb.memberName.toLowerCase().includes(filter.member.toLowerCase()))) &&
    (filter.type === '' || fb.type === filter.type) &&
    (filter.targetName === '' || (fb.targetName && fb.targetName.toLowerCase().includes(filter.targetName.toLowerCase())))
  ) : [];

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
          Danh sách phản hồi
        </Typography>
      </Box>
      <Paper className="p-4 mb-4" sx={{ background: 'var(--admin-sidebar)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Hội viên"
            value={filter.member}
            onChange={e => setFilter(f => ({ ...f, member: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel>Loại phản hồi</InputLabel>
            <Select
              value={filter.type}
              label="Loại phản hồi"
              onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="Gói tập">Gói tập</MenuItem>
              <MenuItem value="Huấn luyện viên">Huấn luyện viên</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Tên đối tượng"
            value={filter.targetName}
            onChange={e => setFilter(f => ({ ...f, targetName: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
        </Box>
      </Paper>
      <TableContainer component={Paper} className="shadow-lg rounded-lg" sx={{ background: 'var(--admin-sidebar)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: 'var(--admin-header)' }}>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Hội viên</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Loại phản hồi</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Tên đối tượng</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Đánh giá</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Ngày gửi</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)' }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} sx={{ color: 'var(--admin-text)' }}>Loading...</TableCell></TableRow>
            ) : filteredFeedback.length === 0 ? (
              <TableRow><TableCell colSpan={6} sx={{ color: 'var(--admin-text)' }}>Không có phản hồi nào</TableCell></TableRow>
            ) : filteredFeedback.map(item => (
              <TableRow key={item._id} className="hover:bg-[var(--admin-accent)]">
                <TableCell sx={{ color: 'var(--admin-text)' }}>{item.memberName}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{item.type}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{item.type === 'Gói tập' ? (item.packageName || item.targetName) : (item.trainerName || item.targetName)}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}><Rating value={item.star || item.rating} readOnly /></TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>
                  <IconButton onClick={() => navigate(`/staff/feedback/view/${item._id}`)} sx={{ color: 'var(--admin-primary)' }}>
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 