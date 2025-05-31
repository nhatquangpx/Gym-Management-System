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

export default function StaffWorkouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ member: '', trainer: '', status: '', date: '' });
  const [searchMember, setSearchMember] = useState('');
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/workouts');
      const data = await res.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa buổi tập này?')) {
      try {
        await fetch(`/api/workouts/${id}`, { method: 'DELETE' });
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const filteredWorkouts = workouts.filter(wk =>
    (filter.member === '' || (wk.memberName && wk.memberName.toLowerCase().includes(filter.member.toLowerCase()))) &&
    (filter.trainer === '' || (wk.trainerName && wk.trainerName.toLowerCase().includes(filter.trainer.toLowerCase()))) &&
    (filter.status === '' || wk.status === filter.status) &&
    (filter.date === '' || (wk.date && wk.date.startsWith(filter.date)))
  );

  const handleSearchHistory = async () => {
    setLoadingHistory(true);
    // Giả lập API, thực tế sẽ fetch từ backend
    setTimeout(() => {
      if (searchMember.trim() === 'HV1234') {
        setServiceHistory([
          { date: '03/04/2025', service: 'Yoga', duration: '01:30', note: 'Tập đúng lộ trình' },
          { date: '05/04/2025', service: 'Gym', duration: '01:00', note: 'Cần tăng cường cardio' },
        ]);
      } else {
        setServiceHistory([]);
      }
      setLoadingHistory(false);
    }, 800);
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
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
          Lịch sử tập luyện
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': { backgroundColor: 'var(--admin-primary-dark)' }
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/staff/workouts/add')}
        >
          Thêm buổi tập
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Hội viên"
            value={filter.member}
            onChange={e => setFilter(f => ({ ...f, member: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            label="Huấn luyện viên"
            value={filter.trainer}
            onChange={e => setFilter(f => ({ ...f, trainer: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
            <Select
              value={filter.status}
              label="Trạng thái"
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              sx={{ color: 'var(--admin-text)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="scheduled">Đã lên lịch</MenuItem>
              <MenuItem value="in-progress">Đang diễn ra</MenuItem>
              <MenuItem value="completed">Hoàn thành</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ngày tập"
            type="date"
            value={filter.date}
            onChange={e => setFilter(f => ({ ...f, date: e.target.value }))}
            size="small"
            InputLabelProps={{ 
              shrink: true,
              style: { color: 'var(--admin-text)' }
            }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
        </Box>
      </Paper>
      <TableContainer component={Paper} sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'var(--admin-header)' }}>
            <TableRow>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Ngày tập</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Hội viên</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Huấn luyện viên</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Thời lượng</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Trạng thái</TableCell>
              <TableCell align="right" sx={{ color: 'var(--admin-text)' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} sx={{ color: 'var(--admin-text)' }}>Loading...</TableCell></TableRow>
            ) : filteredWorkouts.length === 0 ? (
              <TableRow><TableCell colSpan={6} sx={{ color: 'var(--admin-text)' }}>Không có buổi tập nào</TableCell></TableRow>
            ) : filteredWorkouts.map(wk => (
              <TableRow key={wk._id}>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{wk.date ? new Date(wk.date).toLocaleDateString() : ''}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{wk.memberName}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{wk.trainerName}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{wk.duration} phút</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{
                  wk.status === 'completed' ? 'Hoàn thành' :
                  wk.status === 'in-progress' ? 'Đang diễn ra' :
                  wk.status === 'scheduled' ? 'Đã lên lịch' : 'Đã hủy'
                }</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/staff/workouts/${wk._id}`)} sx={{ color: 'var(--admin-text)' }}><VisibilityIcon /></IconButton>
                  <IconButton onClick={() => navigate(`/staff/workouts/edit/${wk._id}`)} sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(wk._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 6, mb: 4 }}>
        <Paper sx={{ p: 3, mb: 2, background: 'var(--admin-sidebar)' }}>
          <h2 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '1.3em', marginBottom: 16 }}>
            Theo dõi lịch sử sử dụng dịch vụ hội viên
          </h2>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField
              label="Nhập mã hội viên"
              value={searchMember}
              onChange={e => setSearchMember(e.target.value)}
              size="small"
              sx={{ minWidth: 220 }}
            />
            <Button
              variant="contained"
              sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 } }}
              onClick={handleSearchHistory}
            >
              Tìm kiếm
            </Button>
          </Box>
          <Table sx={{ background: 'var(--admin-bg)', borderRadius: 2 }}>
            <TableHead>
              <TableRow sx={{ background: 'var(--admin-header)' }}>
                <TableCell className="text-[var(--admin-primary)] font-bold">Ngày tập</TableCell>
                <TableCell className="text-[var(--admin-primary)] font-bold">Dịch vụ sử dụng</TableCell>
                <TableCell className="text-[var(--admin-primary)] font-bold">Thời lượng</TableCell>
                <TableCell className="text-[var(--admin-primary)] font-bold">Ghi chú</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingHistory ? (
                <TableRow><TableCell colSpan={4}>Đang tải...</TableCell></TableRow>
              ) : serviceHistory.length === 0 ? (
                <TableRow><TableCell colSpan={4}>Không có dữ liệu lịch sử</TableCell></TableRow>
              ) : serviceHistory.map((row, idx) => (
                <TableRow key={idx}>
                  <TableCell className="text-[var(--admin-primary)]">{row.date}</TableCell>
                  <TableCell className="text-[var(--admin-primary)]">{row.service}</TableCell>
                  <TableCell className="text-[var(--admin-primary)]">{row.duration}</TableCell>
                  <TableCell className="text-[var(--admin-primary)]">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </div>
  );
} 