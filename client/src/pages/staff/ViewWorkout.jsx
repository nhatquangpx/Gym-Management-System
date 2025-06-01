import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from "@mui/material";
import {
  FitnessCenter as FitnessIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  DirectionsRun as RunIcon,
  Timer as TimerIcon,
  History as HistoryIcon
} from "@mui/icons-material";
import axios from "axios";

const ViewWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberHistory, setMemberHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [workoutRes, historyRes] = await Promise.all([
          axios.get(`/api/schedules/${id}`),
          workout?.memberId ? axios.get(`/api/schedules/member/${workout.memberId}`) : null
        ]);
        
        setWorkout(workoutRes.data.data);
        if (historyRes) {
          setMemberHistory(historyRes.data.data);
        }
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch workout details");
        setLoading(false);
      }
    };

    fetchData();
  }, [id, workout?.memberId]);

  const fetchMemberHistory = async (memberId) => {
    setLoadingHistory(true);
    try {
      const response = await axios.get(`/api/schedules/member/${memberId}`);
      setMemberHistory(response.data.data);
    } catch (err) {
      console.error("Error fetching member history:", err);
    }
    setLoadingHistory(false);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );
  if (error) return <Typography color="error">{error}</Typography>;
  if (!workout) return <Typography>Workout not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Chi tiết buổi tập
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/staff/workouts/edit/${id}`)}
          >
            Chỉnh sửa
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Workout Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin buổi tập
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FitnessIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{workout.workoutType}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TimerIcon sx={{ mr: 1 }} />
                <Typography>Thời lượng: {workout.duration} phút</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TimeIcon sx={{ mr: 1 }} />
                <Typography>
                  Trạng thái:{" "}
                  <Chip
                    label={
                      workout.status === 'completed' ? 'Hoàn thành' :
                      workout.status === 'in-progress' ? 'Đang diễn ra' :
                      workout.status === 'scheduled' ? 'Đã lên lịch' : 'Đã hủy'
                    }
                    color={
                      workout.status === 'completed' ? 'success' :
                      workout.status === 'in-progress' ? 'warning' :
                      workout.status === 'scheduled' ? 'primary' : 'error'
                    }
                    size="small"
                  />
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Member Information */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Thông tin hội viên
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography>
                  {workout.memberName}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Mã hội viên: {workout.memberId}
              </Typography>
            </Paper>
          </Grid>

          {/* Workout Details */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Chi tiết bài tập
              </Typography>
              <Typography paragraph>{workout.exercises}</Typography>
              {workout.notes && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Ghi chú
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {workout.notes}
                  </Typography>
                </>
              )}
            </Paper>
          </Grid>

          {/* Member Workout History */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6">
                  Lịch sử tập luyện
                </Typography>
                <Button
                  startIcon={<HistoryIcon />}
                  onClick={() => fetchMemberHistory(workout.memberId)}
                  disabled={loadingHistory}
                >
                  {loadingHistory ? 'Đang tải...' : 'Làm mới'}
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ngày tập</TableCell>
                      <TableCell>Loại tập</TableCell>
                      <TableCell>Thời lượng</TableCell>
                      <TableCell>Trạng thái</TableCell>
                      <TableCell>Ghi chú</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loadingHistory ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <CircularProgress size={24} />
                        </TableCell>
                      </TableRow>
                    ) : memberHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          Không có lịch sử tập luyện
                        </TableCell>
                      </TableRow>
                    ) : (
                      memberHistory.map((history, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(history.date).toLocaleDateString()}</TableCell>
                          <TableCell>{history.workoutType}</TableCell>
                          <TableCell>{history.duration} phút</TableCell>
                          <TableCell>
                            <Chip
                              label={
                                history.status === 'completed' ? 'Hoàn thành' :
                                history.status === 'in-progress' ? 'Đang diễn ra' :
                                history.status === 'scheduled' ? 'Đã lên lịch' : 'Đã hủy'
                              }
                              color={
                                history.status === 'completed' ? 'success' :
                                history.status === 'in-progress' ? 'warning' :
                                history.status === 'scheduled' ? 'primary' : 'error'
                              }
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{history.notes}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewWorkout; 