import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Grid, TextField, Button,
  MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function EditSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState({
    memberId: '',
    trainerId: '',
    startDate: '',
    endDate: '',
    status: 'active',
    notes: ''
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

      // If editing, fetch schedule data
      if (id) {
        const scheduleRes = await fetch(`/api/schedules/${id}`);
        const scheduleData = await scheduleRes.json();
        setSchedule({
          ...scheduleData,
          startDate: scheduleData.startDate ? new Date(scheduleData.startDate).toISOString().split('T')[0] : '',
          endDate: scheduleData.endDate ? new Date(scheduleData.endDate).toISOString().split('T')[0] : ''
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
    setSchedule(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/schedules/${id}` : '/api/schedules';
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schedule),
      });
      navigate('/admin/schedules');
    } catch (error) {
      console.error('Error saving schedule:', error);
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
          onClick={() => navigate('/admin/schedules')}
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
          {id ? 'Chỉnh sửa lịch tập' : 'Thêm lịch tập mới'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Hội viên</InputLabel>
                <Select
                  name="memberId"
                  value={schedule.memberId}
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
                  value={schedule.trainerId}
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={schedule.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Đang hoạt động</MenuItem>
                  <MenuItem value="completed">Hoàn thành</MenuItem>
                  <MenuItem value="cancelled">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày bắt đầu"
                name="startDate"
                type="date"
                value={schedule.startDate}
                onChange={handleChange}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Ngày kết thúc"
                name="endDate"
                type="date"
                value={schedule.endDate}
                onChange={handleChange}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ghi chú"
                name="notes"
                value={schedule.notes}
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