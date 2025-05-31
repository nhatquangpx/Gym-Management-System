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
  const [feedback, setFeedback] = useState([
    { _id: 1, memberName: 'Nguyễn Văn A', rating: 5, content: 'Phòng tập sạch sẽ, thiết bị hiện đại.', createdAt: '2024-06-01', status: 'read' },
    { _id: 2, memberName: 'Trần Thị B', rating: 4, content: 'Huấn luyện viên nhiệt tình.', createdAt: '2024-06-02', status: 'unread' },
    { _id: 3, memberName: 'Lê Văn C', rating: 3, content: 'Cần bổ sung thêm máy chạy bộ.', createdAt: '2024-06-03', status: 'read' },
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchMember, setSearchMember] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchContent, setSearchContent] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/feedbacks');
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
      await fetch(`/api/feedbacks/${itemToDelete}`, {
        method: 'DELETE',
      });
      fetchFeedback();
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
    setOpenConfirm(false);
    setItemToDelete(null);
  };

  // Lọc danh sách phản hồi theo các trường tìm kiếm (không còn ngày gửi)
  const filteredFeedback = feedback.filter(item =>
    item.memberName.toLowerCase().includes(searchMember.toLowerCase()) &&
    item.status.toLowerCase().includes(searchStatus.toLowerCase()) &&
    item.content.toLowerCase().includes(searchContent.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
          Danh sách phản hồi
        </Typography>
      </Box>

      {/* Thanh tìm kiếm */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Tên hội viên"
          className="p-2 rounded border border-gray-300 min-w-[180px]"
          value={searchMember}
          onChange={e => setSearchMember(e.target.value)}
        />
        <input
          type="text"
          placeholder="Trạng thái"
          className="p-2 rounded border border-gray-300 min-w-[120px]"
          value={searchStatus}
          onChange={e => setSearchStatus(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nội dung"
          className="p-2 rounded border border-gray-300 min-w-[180px]"
          value={searchContent}
          onChange={e => setSearchContent(e.target.value)}
        />
      </div>

      <TableContainer component={Paper} className="shadow-lg rounded-lg" sx={{ background: 'var(--admin-sidebar)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)] text-base">
                <th className="py-3 px-4 text-center">Hội viên</th>
                <th className="py-3 px-4 text-center">Đánh giá</th>
                <th className="py-3 px-4 text-center">Nội dung</th>
                <th className="py-3 px-4 text-center">Ngày gửi</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredFeedback.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có phản hồi nào</td></tr>
              ) : filteredFeedback.map((item) => (
                <tr key={item._id} className="transition">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{item.memberName}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center"><Rating value={item.rating} readOnly /></td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{item.content.substring(0, 50)}...</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center text-base">{item.status === 'read' ? 'Đã đọc' : 'Chưa đọc'}</td>
                  <td className="px-6 py-4 text-center">
                    <IconButton
                      component={Link}
                      to={`/admin/feedback/view/${item._id}`}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      sx={{ color: 'var(--admin-primary)' }}
                      onClick={() => handleDelete(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </td>
                </tr>
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