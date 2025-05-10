import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Grid, Chip, Button,
  Card, CardContent, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export default function ViewWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkout();
  }, [id]);

  const fetchWorkout = async () => {
    try {
      const response = await fetch(`/api/workouts/${id}`);
      const data = await response.json();
      setWorkout(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workout:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!workout) {
    return <div>Workout not found</div>;
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/workouts')}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/admin/workouts/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          Chi tiết buổi tập
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Thông tin buổi tập
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày tập
                    </Typography>
                    <Typography variant="body1">
                      {new Date(workout.date).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Thời gian
                    </Typography>
                    <Typography variant="body1">{workout.duration} phút</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      label={workout.status}
                      color={
                        workout.status === 'completed' ? 'success' :
                        workout.status === 'in-progress' ? 'warning' : 'error'
                      }
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
                  Thông tin người tham gia
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Hội viên
                    </Typography>
                    <Typography variant="body1">{workout.memberName}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Huấn luyện viên
                    </Typography>
                    <Typography variant="body1">{workout.trainerName}</Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Tiến độ tập luyện
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ghi chú
                    </Typography>
                    <Typography variant="body1" className="whitespace-pre-wrap">
                      {workout.notes || 'Không có ghi chú'}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Đánh giá
                    </Typography>
                    <Typography variant="body1">
                      {workout.evaluation || 'Chưa có đánh giá'}
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