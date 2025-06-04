import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Rating, TextField, Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function StaffFeedback() {
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ member: '', type: '', targetName: '' });

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/feedbacks', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      const arr = Array.isArray(data) ? data : (data.data || data.feedbacks || []);
      setFeedback(arr);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
    setLoading(false);
  };

  const filteredFeedback = feedback.filter(fb =>
    (filter.member === '' || (fb.memberName && fb.memberName.toLowerCase().includes(filter.member.toLowerCase()))) &&
    (filter.type === '' || (fb.type && fb.type.toLowerCase().includes(filter.type.toLowerCase()))) &&
    (filter.targetName === '' || (fb.targetName && fb.targetName.toLowerCase().includes(filter.targetName.toLowerCase())))
  );

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography
          variant="h4"
          className="font-bold"
          sx={{ color: '#4f8cff', fontWeight: 700, fontSize: '2.2em', mb: 4 }}
        >
          Danh sách phản hồi
        </Typography>
      </Box>
      <Paper sx={{ p: 2, mb: 3, background: 'var(--admin-sidebar)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Tìm kiếm hội viên"
            value={filter.member}
            onChange={e => setFilter(f => ({ ...f, member: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Tìm kiếm loại phản hồi"
            value={filter.type}
            onChange={e => setFilter(f => ({ ...f, type: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Tìm kiếm tên đối tượng"
            value={filter.targetName}
            onChange={e => setFilter(f => ({ ...f, targetName: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
        </Box>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Hội viên</th>
                <th className="py-3 px-4 text-center">Loại phản hồi</th>
                <th className="py-3 px-4 text-center">Tên đối tượng</th>
                <th className="py-3 px-4 text-center">Đánh giá</th>
                <th className="py-3 px-4 text-center">Ngày gửi</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
              ) : filteredFeedback.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có phản hồi nào</td></tr>
              ) : filteredFeedback.map(item => (
                <tr key={item._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{item.memberName}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{item.type}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{item.targetName}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center"><Rating value={item.star} readOnly /></td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><IconButton sx={{ color: 'var(--admin-primary)' }} onClick={() => navigate(`/admin/feedback/view/${item._id}`)}><VisibilityIcon /></IconButton></Tooltip>
                    </div>
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