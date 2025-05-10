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
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-white">Danh sách phản hồi</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/staff/feedback/add')}
        >
          Thêm phản hồi
        </Button>
      </Box>
      <Paper className="p-4 mb-4">
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Hội viên"
            value={filter.member}
            onChange={e => setFilter(f => ({ ...f, member: e.target.value }))}
            size="small"
          />
          <TextField
            label="Trạng thái"
            value={filter.status}
            onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
            size="small"
          />
        </Box>
      </Paper>
      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hội viên</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Ngày gửi</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            ) : filteredFeedback.length === 0 ? (
              <TableRow><TableCell colSpan={6}>Không có phản hồi nào</TableCell></TableRow>
            ) : filteredFeedback.map(item => (
              <TableRow key={item._id}>
                <TableCell>{item.memberName}</TableCell>
                <TableCell>
                  <Rating value={item.rating} readOnly />
                </TableCell>
                <TableCell>{item.content.substring(0, 50)}...</TableCell>
                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip
                    label={item.status}
                    color={item.status === 'read' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/staff/feedback/${item._id}`)} color="primary">
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