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
import HistoryIcon from '@mui/icons-material/History';

export default function StaffWorkouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ member: '', trainer: '', status: '', date: '' });
  const [memberHistory, setMemberHistory] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schedules');
      const data = await res.json();
      setWorkouts(data.data);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
    setLoading(false);
  };

  const fetchMemberHistory = async (memberId) => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`/api/schedules/member/${memberId}`);
      const data = await res.json();
      setMemberHistory(data.data);
      setShowHistory(true);
    } catch (error) {
      console.error('Error fetching member history:', error);
    }
    setLoadingHistory(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa buổi tập này?')) {
      try {
        await fetch(`/api/schedules/${id}`, { method: 'DELETE' });
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
                  <IconButton 
                    sx={{ color: 'var(--admin-primary)' }}
                    onClick={() => {
                      setSelectedMember(wk.memberId);
                      fetchMemberHistory(wk.memberId);
                    }}
                  >
                    <HistoryIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
                {loadingHistory ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Đang tải...
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
                      <TableCell>{
                        history.status === 'completed' ? 'Hoàn thành' :
                        history.status === 'in-progress' ? 'Đang diễn ra' :
                        history.status === 'scheduled' ? 'Đã lên lịch' : 'Đã hủy'
                      }</TableCell>
                      <TableCell>{history.notes}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowHistory(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 