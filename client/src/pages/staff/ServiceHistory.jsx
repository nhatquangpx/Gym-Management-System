import { useState } from 'react';
import { TextField, Button, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography } from '@mui/material';
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
      <Paper sx={{ p: 3, mb: 2, background: 'var(--admin-sidebar)' }}>
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
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
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
            ) : serviceHistory.length === 0 && !error ? (
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
    </div>
  );
} 