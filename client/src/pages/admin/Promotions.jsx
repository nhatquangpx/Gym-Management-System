import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const fakePromotions = [
  { id: 1, startDate: '2024-06-01', endDate: '2024-06-30', description: 'Ưu đãi hè 20%', percent: 20 },
  { id: 2, startDate: '2024-07-01', endDate: '2024-07-15', description: 'Ưu đãi thành viên mới 15%', percent: 15 },
];

export default function Promotions() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState(fakePromotions);

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ưu đãi này?')) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
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
          Quản lý ưu đãi
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': { backgroundColor: 'var(--admin-primary-dark)' }
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/promotions/add')}
        >
          Thêm ưu đãi
        </Button>
      </Box>
      <TableContainer component={Paper} sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'var(--admin-header)' }}>
            <TableRow>
              <TableCell sx={{ color: 'var(--admin-primary)', fontWeight: 700 }}>Ngày bắt đầu</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)', fontWeight: 700 }}>Ngày kết thúc</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)', fontWeight: 700 }}>Chi tiết ưu đãi</TableCell>
              <TableCell sx={{ color: 'var(--admin-primary)', fontWeight: 700 }}>% Ưu đãi</TableCell>
              <TableCell align="right" sx={{ color: 'var(--admin-primary)', fontWeight: 700 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.length === 0 ? (
              <TableRow><TableCell colSpan={5} sx={{ color: 'var(--admin-text)' }}>Không có ưu đãi nào</TableCell></TableRow>
            ) : promotions.map(p => (
              <TableRow key={p.id} className="hover:bg-[var(--admin-accent)]">
                <TableCell sx={{ color: 'var(--admin-text)' }}>{p.startDate}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{p.endDate}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{p.description}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{p.percent}%</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/admin/promotions/view/${p.id}`)} sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton>
                  <IconButton onClick={() => navigate(`/admin/promotions/edit/${p.id}`)} sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 