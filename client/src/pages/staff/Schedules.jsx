import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';

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
          Danh sách lịch tập
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary-dark)' } }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/staff/schedules/add')}
        >
          Thêm lịch tập
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
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />
          <TextField
            label="Huấn luyện viên"
            value={filter.trainer}
            onChange={e => setFilter(f => ({ ...f, trainer: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
            <Select
              value={filter.status}
              label="Trạng thái"
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              sx={{
                color: 'var(--admin-text)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' },
                '.MuiSvgIcon-root': { color: 'var(--admin-text)' }
              }}
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
            InputLabelProps={{ 
              shrink: true,
              style: { color: 'var(--admin-text)' }
            }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />
        </Box>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-left">Hội viên</th>
                <th className="py-3 px-4 text-left">Huấn luyện viên</th>
                <th className="py-3 px-4 text-left">Ngày bắt đầu</th>
                <th className="py-3 px-4 text-left">Ngày kết thúc</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
              ) : filteredSchedules.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có lịch tập nào</td></tr>
              ) : filteredSchedules.map(sc => (
                <tr key={sc._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{sc.memberName}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{sc.trainerName}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{sc.startDate ? new Date(sc.startDate).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{sc.endDate ? new Date(sc.endDate).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{
                    sc.status === 'active' ? 'Đang hoạt động' :
                    sc.status === 'completed' ? 'Hoàn thành' : 'Đã hủy'
                  }</td>
                  <td className="px-6 py-4 text-center">
                    <IconButton onClick={() => navigate(`/staff/schedules/${sc._id}`)} sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => navigate(`/staff/schedules/edit/${sc._id}`)} sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton>
                    <IconButton sx={{ color: '#d32f2f' }} onClick={() => handleDelete(sc._id)}><DeleteIcon /></IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
} 