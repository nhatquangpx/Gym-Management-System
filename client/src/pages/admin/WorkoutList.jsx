import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Dialog, DialogTitle, DialogContent, DialogActions, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import HistoryIcon from '@mui/icons-material/History';

export default function WorkoutList() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ member: '', trainer: '', status: '', date: '' });
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [memberHistory, setMemberHistory] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/schedules', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setWorkouts(data.data || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setWorkouts([]);
    }
    setLoading(false);
  };

  const fetchMemberHistory = async (memberId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/schedules/member/${memberId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setMemberHistory(data.data || []);
      setShowHistory(true);
    } catch (error) {
      console.error('Error fetching member history:', error);
      setMemberHistory([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa buổi tập này?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`/api/schedules/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const filteredWorkouts = (workouts || []).filter(wk =>
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
      <Paper className="p-4 mb-4" sx={{ background: 'var(--admin-sidebar)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Hội viên"
            value={filter.member}
            onChange={e => setFilter(f => ({ ...f, member: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Huấn luyện viên"
            value={filter.trainer}
            onChange={e => setFilter(f => ({ ...f, trainer: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <FormControl size="small" style={{ minWidth: 120 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
            <Select
              value={filter.status}
              label="Trạng thái"
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              sx={{ color: 'var(--admin-text)' }}
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
            InputLabelProps={{ shrink: true, style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
        </Box>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Ngày tập</th>
                <th className="py-3 px-4 text-center">Giờ bắt đầu</th>
                <th className="py-3 px-4 text-center">Giờ kết thúc</th>
                <th className="py-3 px-4 text-center">Hội viên</th>
                <th className="py-3 px-4 text-center">Huấn luyện viên</th>
                <th className="py-3 px-4 text-center">Loại tập</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8}>Loading...</td></tr>
              ) : filteredWorkouts.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-4">Không có buổi tập nào</td></tr>
              ) : filteredWorkouts.map(wk => (
                <tr key={wk._id}>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {wk.date ? new Date(wk.date).toLocaleDateString() : ''}
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {wk.timeStart || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {wk.timeEnd || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {wk.memberId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {wk.trainerId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {wk.workoutType === 'gym' ? 'Gym' : 'Yoga'}
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {wk.status === 'Chưa tập' ? 'Chưa tập' :
                     wk.status === 'Đã tập' ? 'Đã tập' : 'Vắng mặt'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <IconButton 
                      sx={{ color: 'var(--admin-primary)' }} 
                      onClick={() => navigate(`/admin/workouts/view/${wk._id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => navigate(`/admin/workouts/edit/${wk._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <Tooltip title="Xóa">
                      <IconButton 
                        size="small" 
                        sx={{ color: '#d32f2f' }} 
                        onClick={() => { setItemToDelete(wk._id); setOpenConfirm(true); }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Xem lịch sử">
                      <IconButton 
                        size="small" 
                        sx={{ color: 'var(--admin-primary)' }} 
                        onClick={() => { setSelectedMember(wk.memberId?._id); fetchMemberHistory(wk.memberId?._id); }}
                      >
                        <HistoryIcon />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      <Dialog 
        open={showHistory} 
        onClose={() => setShowHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Lịch sử tập luyện của hội viên
        </DialogTitle>
        <DialogContent>
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
                {memberHistory.map((workout, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(workout.date).toLocaleDateString()}</TableCell>
                    <TableCell>{workout.workoutType}</TableCell>
                    <TableCell>{workout.duration} phút</TableCell>
                    <TableCell>{workout.status}</TableCell>
                    <TableCell>{workout.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa buổi tập này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button 
            sx={{ color: '#d32f2f' }} 
            onClick={async () => { 
              await handleDelete(itemToDelete); 
              setOpenConfirm(false); 
              setItemToDelete(null); 
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 