import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function StaffSchedules() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ member: '', trainer: '', status: '', startDate: '' });

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedules');
      const data = await res.json();
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch tập này?')) {
      try {
        await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  const filteredSchedules = schedules.filter(sc =>
    (filter.member === '' || (sc.memberName && sc.memberName.toLowerCase().includes(filter.member.toLowerCase()))) &&
    (filter.trainer === '' || (sc.trainerName && sc.trainerName.toLowerCase().includes(filter.trainer.toLowerCase()))) &&
    (filter.status === '' || sc.status === filter.status) &&
    (filter.startDate === '' || (sc.startDate && sc.startDate.startsWith(filter.startDate)))
  );

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-white">Danh sách lịch tập</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate('/staff/schedules/add')}
        >
          Thêm lịch tập
        </Button>
      </Box>
      <Paper className="p-4 mb-4">
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Hội viên"
            value={filter.member}
            onChange={e => setFilter(f => ({ ...f, member: e.target.value }))}
            size="small"
          />
          <TextField
            label="Huấn luyện viên"
            value={filter.trainer}
            onChange={e => setFilter(f => ({ ...f, trainer: e.target.value }))}
            size="small"
          />
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filter.status}
              label="Trạng thái"
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="active">Đang hoạt động</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ngày bắt đầu"
            type="date"
            value={filter.startDate}
            onChange={e => setFilter(f => ({ ...f, startDate: e.target.value }))}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Hội viên</TableCell>
              <TableCell>Huấn luyện viên</TableCell>
              <TableCell>Ngày bắt đầu</TableCell>
              <TableCell>Ngày kết thúc</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell align="right">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            ) : filteredSchedules.length === 0 ? (
              <TableRow><TableCell colSpan={6}>Không có lịch tập nào</TableCell></TableRow>
            ) : filteredSchedules.map(sc => (
              <TableRow key={sc._id}>
                <TableCell>{sc.memberName}</TableCell>
                <TableCell>{sc.trainerName}</TableCell>
                <TableCell>{sc.startDate ? new Date(sc.startDate).toLocaleDateString() : ''}</TableCell>
                <TableCell>{sc.endDate ? new Date(sc.endDate).toLocaleDateString() : ''}</TableCell>
                <TableCell>{
                  sc.status === 'active' ? 'Đang hoạt động' :
                  sc.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'
                }</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/staff/schedules/${sc._id}`)}><VisibilityIcon /></IconButton>
                  <IconButton onClick={() => navigate(`/staff/schedules/edit/${sc._id}`)}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(sc._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 