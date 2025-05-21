import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Grid, TextField, Button,
  MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function EditWorkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState({
    date: '',
    duration: '',
    status: 'scheduled',
    memberId: '',
    trainerId: '',
    notes: '',
    evaluation: ''
  });
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // Fetch members and trainers
      const [membersRes, trainersRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/employees?role=trainer')
      ]);
      const [membersData, trainersData] = await Promise.all([
        membersRes.json(),
        trainersRes.json()
      ]);
      setMembers(membersData);
      setTrainers(trainersData);

      // If editing, fetch workout data
      if (id) {
        const workoutRes = await fetch(`/api/workouts/${id}`);
        const workoutData = await workoutRes.json();
        setWorkout({
          ...workoutData,
          date: new Date(workoutData.date).toISOString().split('T')[0]
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkout(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/workouts/${id}` : '/api/workouts';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workout),
      });
      
      navigate('/admin/workouts');
    } catch (error) {
      console.error('Error saving workout:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Lưu thay đổi
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          {id ? 'Chỉnh sửa buổi tập' : 'Thêm buổi tập mới'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày tập"
                name="date"
                type="date"
                value={workout.date}
                onChange={handleChange}
                required
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Thời gian (phút)"
                name="duration"
                type="number"
                value={workout.duration}
                onChange={handleChange}
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={workout.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="scheduled">Đã lên lịch</MenuItem>
                  <MenuItem value="in-progress">Đang diễn ra</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Hội viên</InputLabel>
                <Select
                  name="memberId"
                  value={workout.memberId}
                  onChange={handleChange}
                  label="Hội viên"
                  required
                >
                  {members.map(member => (
                    <MenuItem key={member._id} value={member._id}>
                      {member.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Huấn luyện viên</InputLabel>
                <Select
                  name="trainerId"
                  value={workout.trainerId}
                  onChange={handleChange}
                  label="Huấn luyện viên"
                  required
                >
                  {trainers.map(trainer => (
                    <MenuItem key={trainer._id} value={trainer._id}>
                      {trainer.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="notes"
                value={workout.notes}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
              <TextField
                fullWidth
                label="Đánh giá"
                name="evaluation"
                value={workout.evaluation}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
} 