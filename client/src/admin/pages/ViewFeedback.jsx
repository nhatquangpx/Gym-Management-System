import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Grid, Chip, Button,
  Card, CardContent, Rating
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';

export default function ViewFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, [id]);

  const fetchFeedback = async () => {
    try {
      const response = await fetch(`/api/feedback/${id}`);
      const data = await response.json();
      setFeedback(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching feedback:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phản hồi này?')) {
      try {
        await fetch(`/api/feedback/${id}`, {
          method: 'DELETE',
        });
        navigate('/admin/feedback');
      } catch (error) {
        console.error('Error deleting feedback:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!feedback) {
    return <div>Feedback not found</div>;
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/feedback')}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={handleDelete}
        >
          Xóa phản hồi
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          Chi tiết phản hồi
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Thông tin người gửi
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Hội viên
                    </Typography>
                    <Typography variant="body1">{feedback.memberName}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày gửi
                    </Typography>
                    <Typography variant="body1">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      label={feedback.status}
                      color={feedback.status === 'read' ? 'success' : 'warning'}
                      size="small"
                    />
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Nội dung phản hồi
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Đánh giá
                    </Typography>
                    <Rating value={feedback.rating} readOnly />
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Nội dung
                    </Typography>
                    <Typography variant="body1" className="whitespace-pre-wrap">
                      {feedback.content}
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
} 