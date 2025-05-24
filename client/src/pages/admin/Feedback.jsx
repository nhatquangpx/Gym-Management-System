import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Typography, Box, Chip, Rating, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function Feedback() {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`/api/feedback/${itemToDelete}`, {
        method: 'DELETE',
      });
      fetchFeedback();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
    setOpenConfirm(false);
    setItemToDelete(null);
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

      <TableContainer component={Paper} className="shadow-lg rounded-lg" sx={{ background: 'var(--admin-sidebar)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)] text-base">
                <th className="py-3 px-4 text-left text-[var(--admin-primary)] font-bold">Hội viên</th>
                <th className="py-3 px-4 text-left text-[var(--admin-primary)] font-bold">Đánh giá</th>
                <th className="py-3 px-4 text-left text-[var(--admin-primary)] font-bold">Nội dung</th>
                <th className="py-3 px-4 text-left text-[var(--admin-primary)] font-bold">Ngày gửi</th>
                <th className="py-3 px-4 text-left text-[var(--admin-primary)] font-bold">Trạng thái</th>
                <th className="py-3 px-4 text-left text-[var(--admin-primary)] font-bold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {feedback.map((item) => (
                <TableRow key={item._id} className="hover:bg-[#252525] transition">
                  <TableCell className="text-[var(--admin-primary)]">{item.memberName}</TableCell>
                  <TableCell className="text-[var(--admin-primary)]"><Rating value={item.rating} readOnly /></TableCell>
                  <TableCell className="text-[var(--admin-primary)]">{item.content.substring(0, 50)}...</TableCell>
                  <TableCell className="text-[var(--admin-primary)]">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-[var(--admin-primary)]">
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
            </tbody>
          </table>
        </div>
      </TableContainer>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa phản hồi này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 