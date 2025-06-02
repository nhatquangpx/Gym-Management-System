import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';

export default function WorkoutList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState({ member: '' });

  useEffect(() => {
    fetchMemberUsage();
  }, []);

  const fetchMemberUsage = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/schedules/member-usage', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await res.json();
      setMembers(data.data || []);
    } catch (error) {
      console.error('Error fetching member usage:', error);
      setMembers([]);
    }
    setLoading(false);
  };

  const filteredMembers = members.filter(member =>
    filter.member === '' || 
    (member.name && member.name.toLowerCase().includes(filter.member.toLowerCase()))
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
          Lịch sử sử dụng dịch vụ
        </Typography>
      </Box>
      <Paper className="p-4 mb-4" sx={{ background: 'var(--admin-sidebar)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Tìm kiếm hội viên"
            value={filter.member}
            onChange={e => setFilter(f => ({ ...f, member: e.target.value }))}
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
                <th className="py-3 px-4 text-center">Tổng số buổi đã sử dụng</th>
                <th className="py-3 px-4 text-center">Ngày sử dụng gần nhất</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4}>Loading...</td></tr>
              ) : filteredMembers.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4">Không có dữ liệu</td></tr>
              ) : filteredMembers.map(member => (
                <tr key={member._id}>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {member.name}
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {member.totalSessions} buổi
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    {member.lastUsed ? new Date(member.lastUsed).toLocaleDateString() : 'Chưa sử dụng'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      size="small"
                      startIcon={<HistoryIcon />}
                      onClick={() => navigate(`/staff/service-history/view/${member._id}`)}
                    >
                      Xem chi tiết
                    </Button>
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