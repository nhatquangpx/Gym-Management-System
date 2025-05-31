import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Chip, CircularProgress, Button, Rating } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function ViewFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/feedbacks/${id}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();
        setFeedback(result.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id]);

  if (loading) return <Box className="p-6"><CircularProgress /></Box>;
  if (!feedback) return <Box className="p-6">Không tìm thấy phản hồi</Box>;

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-blue-600">Chi tiết phản hồi</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/feedback')}
        >
          Quay lại
        </Button>
      </Box>
      <Paper className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-2xl mx-auto">
        <table className="w-full mb-6">
          <tbody>
            <tr>
              <td className="font-semibold pr-4 py-2">Hội viên</td>
              <td>{feedback.memberName}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-2">Loại phản hồi</td>
              <td>{feedback.type}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-2">Tên đối tượng</td>
              <td>{feedback.targetName}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-2">Đánh giá</td>
              <td><Rating value={feedback.star} readOnly /></td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-2">Ngày gửi</td>
              <td>{new Date(feedback.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr>
              <td className="font-semibold pr-4 py-2">Nội dung mô tả</td>
              <td>{feedback.text}</td>
            </tr>
          </tbody>
        </table>
        {feedback.reply && (
          <Box className="mt-6">
            <Typography className="text-lg font-semibold mb-2">Phản hồi từ quản trị viên</Typography>
            <Typography className="text-gray-700 whitespace-pre-wrap">{feedback.reply}</Typography>
          </Box>
        )}
      </Paper>
    </div>
  );
} 