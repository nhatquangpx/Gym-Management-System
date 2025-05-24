import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Typography, Box, Chip, Rating, Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedback');
      const data = await response.json();
      setFeedback(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      try {
        await fetch(`/api/feedback/${id}`, {
          method: 'DELETE',
        });
        fetchFeedback();
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold" sx={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', mb: 4 }}>
          Danh sách phản hồi
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': {
              backgroundColor: 'var(--admin-primary)',
              opacity: 0.9
            }
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/feedback/add')}
        >
          Thêm phản hồi
        </Button>
      </Box>

      <TableContainer component={Paper} className="shadow-lg rounded-lg" sx={{ background: 'var(--admin-sidebar)' }}>
        <Table>
          <TableHead>
            <TableRow className="bg-[var(--admin-header)] text-[var(--admin-primary)] text-base">
              <TableCell>Hội viên</TableCell>
              <TableCell>Đánh giá</TableCell>
              <TableCell>Nội dung</TableCell>
              <TableCell>Ngày gửi</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedback.map((item) => (
              <TableRow key={item._id} className="hover:bg-[#252525] transition">
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
                  <IconButton
                    component={Link}
                    to={`/admin/feedback/view/${item._id}`}
                    color="primary"
                  >
                    <VisibilityIcon />
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
    </div>
  );
} 