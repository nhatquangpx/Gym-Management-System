import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function WorkoutList() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([
    { _id: 1, date: '2024-06-01', memberName: 'Nguyễn Văn A', trainerName: 'HLV Trần B', duration: 60, status: 'completed' },
    { _id: 2, date: '2024-06-02', memberName: 'Trần Thị B', trainerName: 'HLV Lê C', duration: 45, status: 'in-progress' },
    { _id: 3, date: '2024-06-03', memberName: 'Lê Văn C', trainerName: 'HLV Nguyễn D', duration: 30, status: 'scheduled' },
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ member: '', trainer: '', status: '', date: '' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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

  return (
    <div className="p-6">
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
          Danh sách buổi tập
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/workouts/add')}
        >
          Thêm buổi tập
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
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Ngày tập</th>
                <th className="py-3 px-4 text-center">Hội viên</th>
                <th className="py-3 px-4 text-center">Huấn luyện viên</th>
                <th className="py-3 px-4 text-center">Thời lượng</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6}>Loading...</td></tr>
              ) : filteredWorkouts.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có buổi tập nào</td></tr>
              ) : filteredWorkouts.map(wk => (
                <tr key={wk._id}>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{wk.date ? new Date(wk.date).toLocaleDateString() : ''}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{wk.memberName}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{wk.trainerName}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{wk.duration} phút</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{
                    wk.status === 'completed' ? 'Hoàn thành' :
                    wk.status === 'in-progress' ? 'Đang diễn ra' :
                    wk.status === 'scheduled' ? 'Đã lên lịch' : 'Đã hủy'
                  }</td>
                  <td className="px-6 py-4 text-center">
                    <IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => navigate(`/admin/workouts/view/${wk._id}`)}><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => navigate(`/admin/workouts/edit/${wk._id}`)}><EditIcon /></IconButton>
                    <IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => { setItemToDelete(wk._id); setOpenConfirm(true); }}><DeleteIcon /></IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa buổi tập này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={async () => { await handleDelete(itemToDelete); setOpenConfirm(false); setItemToDelete(null); }}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 