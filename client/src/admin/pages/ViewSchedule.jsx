import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Grid, Chip, Button, Card, CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export default function ViewSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedule();
  }, [id]);

  const fetchSchedule = async () => {
    try {
      const response = await fetch(`/api/schedules/${id}`);
      const data = await response.json();
      setSchedule(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedule:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!schedule) {
    return <div>Schedule not found</div>;
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/schedules')}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/admin/schedules/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>
      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          Chi tiết lịch tập
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Thông tin chung
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Hội viên
                    </Typography>
                    <Typography variant="body1">{schedule.memberName}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Huấn luyện viên
                    </Typography>
                    <Typography variant="body1">{schedule.trainerName}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      label={
                        schedule.status === 'active' ? 'Đang hoạt động' :
                        schedule.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'
                      }
                      color={
                        schedule.status === 'active' ? 'success' :
                        schedule.status === 'completed' ? 'primary' : 'error'
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
                  Thời gian
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày bắt đầu
                    </Typography>
                    <Typography variant="body1">
                      {schedule.startDate ? new Date(schedule.startDate).toLocaleDateString() : ''}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày kết thúc
                    </Typography>
                    <Typography variant="body1">
                      {schedule.endDate ? new Date(schedule.endDate).toLocaleDateString() : ''}
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Ghi chú
                </Typography>
                <Typography variant="body1" className="whitespace-pre-wrap">
                  {schedule.notes || 'Không có ghi chú'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
} 