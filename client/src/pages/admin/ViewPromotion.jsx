import { useParams, useNavigate } from 'react-router-dom';
import { Paper, Typography, Box, Button } from '@mui/material';

const fakePromotions = [
  { id: 1, startDate: '2024-06-01', endDate: '2024-06-30', description: 'Ưu đãi hè 20%', percent: 20 },
  { id: 2, startDate: '2024-07-01', endDate: '2024-07-15', description: 'Ưu đãi thành viên mới 15%', percent: 15 },
];

export default function ViewPromotion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const promotion = fakePromotions.find(p => p.id === Number(id));
  if (!promotion) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy ưu đãi.</div>;
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <Typography variant="h4" className="font-bold mb-6" sx={{ color: '#4f8cff', fontWeight: 700, fontSize: '2.2em' }}>Thông tin ưu đãi</Typography>
      <Paper className="p-6 shadow-lg rounded-lg max-w-xl mx-auto" sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box mb={2}><b>Ngày bắt đầu:</b> {promotion.startDate}</Box>
        <Box mb={2}><b>Ngày kết thúc:</b> {promotion.endDate}</Box>
        <Box mb={2}><b>Chi tiết ưu đãi:</b> {promotion.description}</Box>
        <Box mb={2}><b>Phần trăm ưu đãi:</b> {promotion.percent}%</Box>
        <Button variant="outlined" onClick={() => navigate('/admin/promotions')} sx={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)', '&:hover': { borderColor: 'var(--admin-primary)', color: 'var(--admin-primary)' } }}>Quay lại</Button>
      </Paper>
    </div>
  );
} 