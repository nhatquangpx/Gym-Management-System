import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, Chip, Rating
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

export default function StaffFeedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ member: '', status: '' });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      setFeedback(data);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      try {
        await fetch(`/api/feedback/${id}`, { method: 'DELETE' });
        fetchFeedback();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  const filteredFeedback = feedback.filter(fb =>
    (filter.member === '' || (fb.memberName && fb.memberName.toLowerCase().includes(filter.member.toLowerCase()))) &&
    (filter.status === '' || fb.status === filter.status)
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
          Danh sách phản hồi
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary-dark)' } }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/staff/feedback/add')}
        >
          Thêm phản hồi
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Hội viên"
            value={filter.member}
            onChange={e => setFilter(f => ({ ...f, member: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />
          <TextField
            label="Trạng thái"
            value={filter.status}
            onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
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
                <th className="py-3 px-4 text-left">Hội viên</th>
                <th className="py-3 px-4 text-left">Đánh giá</th>
                <th className="py-3 px-4 text-left">Nội dung</th>
                <th className="py-3 px-4 text-left">Ngày gửi</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
              ) : filteredFeedback.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có phản hồi nào</td></tr>
              ) : filteredFeedback.map(item => (
                <tr key={item._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{item.memberName}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left"><Rating value={item.rating} readOnly /></td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{item.content.substring(0, 50)}...</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">
                    <Chip
                      label={item.status}
                      color={item.status === 'read' ? 'success' : 'warning'}
                      size="small"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <IconButton onClick={() => navigate(`/staff/feedback/${item._id}`)} sx={{ color: 'var(--admin-primary)' }}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
} 