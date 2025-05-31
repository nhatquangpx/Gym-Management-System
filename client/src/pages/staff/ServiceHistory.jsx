import { useState } from 'react';
import { TextField, Button, Paper, Box, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function ServiceHistory() {
  const [searchMember, setSearchMember] = useState('');
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');

  const handleSearchHistory = async () => {
    setLoadingHistory(true);
    setError('');
    // Giả lập API, thực tế sẽ fetch từ backend
    setTimeout(() => {
      if (searchMember.trim() === 'HV1234') {
        setServiceHistory([
          { date: '03/04/2025', service: 'Yoga', duration: '01:30', note: 'Tập đúng lộ trình' },
          { date: '05/04/2025', service: 'Gym', duration: '01:00', note: 'Cần tăng cường cardio' },
        ]);
      } else if (searchMember.trim() === '') {
        setServiceHistory([]);
        setError('Vui lòng nhập mã hội viên.');
      } else {
        setServiceHistory([]);
        setError('Không tìm thấy hội viên hoặc không có dữ liệu lịch sử.');
      }
      setLoadingHistory(false);
    }, 800);
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)', minHeight: '100vh' }}>
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
          Theo dõi sử dụng dịch vụ
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': { backgroundColor: 'var(--admin-primary-dark)' }
          }}
          startIcon={<AddIcon />}
          onClick={() => alert('Chức năng này chỉ demo UI!')}
        >
          Thêm lịch sử
        </Button>
      </Box>
      <Paper sx={{ p: 2, mb: 3, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Nhập mã hội viên"
            value={searchMember}
            onChange={e => setSearchMember(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' },
              minWidth: 220
            }}
          />
          <Button
            variant="contained"
            sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary-dark)' } }}
            onClick={handleSearchHistory}
          >
            Tìm kiếm
          </Button>
        </Box>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        {error && <Typography color="error" sx={{ mb: 2, mt: 2 }}>{error}</Typography>}
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-left">Ngày tập</th>
                <th className="py-3 px-4 text-left">Dịch vụ sử dụng</th>
                <th className="py-3 px-4 text-left">Thời lượng</th>
                <th className="py-3 px-4 text-left">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {loadingHistory ? (
                <tr><td colSpan={4} className="text-center py-4">Đang tải...</td></tr>
              ) : serviceHistory.length === 0 && !error ? (
                <tr><td colSpan={4} className="text-center py-4">Không có dữ liệu lịch sử</td></tr>
              ) : serviceHistory.map((row, idx) => (
                <tr key={idx} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{row.date}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{row.service}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{row.duration}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
} 