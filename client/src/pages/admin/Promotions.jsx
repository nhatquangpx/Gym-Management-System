import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Paper, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, TextField, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LoyaltyIcon from '@mui/icons-material/Loyalty';

const fakePromotions = [
  { id: 1, startDate: '2024-06-01', endDate: '2024-06-30', description: 'Ưu đãi hè 20%', percent: 20 },
  { id: 2, startDate: '2024-07-01', endDate: '2024-07-15', description: 'Ưu đãi thành viên mới 15%', percent: 15 },
];

export default function Promotions() {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState(fakePromotions);
  const [searchDesc, setSearchDesc] = useState("");
  const [searchPercent, setSearchPercent] = useState("");
  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPromotionId, setSelectedPromotionId] = useState(null);

  const handleDelete = (id) => {
    setSelectedPromotionId(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPromotionId) {
      setPromotions(promotions.filter(p => p.id !== selectedPromotionId));
      setOpenConfirm(false);
    }
  };

  // Lọc danh sách ưu đãi theo mô tả, phần trăm, ngày bắt đầu/kết thúc
  const filteredPromotions = promotions.filter(p =>
    p.description.toLowerCase().includes(searchDesc.toLowerCase()) &&
    (searchPercent === '' || p.percent.toString().includes(searchPercent)) &&
    (searchStart === '' || p.startDate.includes(searchStart)) &&
    (searchEnd === '' || p.endDate.includes(searchEnd))
  );

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
          Danh sách ưu đãi
        </Typography>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: 'var(--admin-primary)',
            '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
          }}
          startIcon={<AddIcon />}
          onClick={() => navigate('/admin/promotions/add')}
        >
          Thêm ưu đãi
        </Button>
      </Box>
      {/* Thanh tìm kiếm */}
      <Paper className="p-4 mb-6" sx={{ background: 'var(--admin-sidebar)' }}>
        <div className="flex flex-wrap gap-4">
          <TextField
            label="Mô tả ưu đãi"
            value={searchDesc}
            onChange={e => setSearchDesc(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="% Ưu đãi"
            value={searchPercent}
            onChange={e => setSearchPercent(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Ngày bắt đầu (yyyy-mm-dd)"
            value={searchStart}
            onChange={e => setSearchStart(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Ngày kết thúc (yyyy-mm-dd)"
            value={searchEnd}
            onChange={e => setSearchEnd(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
        </div>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Ngày bắt đầu</th>
                <th className="py-3 px-4 text-center">Ngày kết thúc</th>
                <th className="py-3 px-4 text-center">Chi tiết ưu đãi</th>
                <th className="py-3 px-4 text-center">% Ưu đãi</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">Không có ưu đãi nào</td></tr>
              ) : filteredPromotions.map((p) => (
                <tr key={p.id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.startDate}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.endDate}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.description}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.percent}%</td>
                  <td className="px-6 py-4 text-center">
                    <IconButton onClick={() => navigate(`/admin/promotions/view/${p.id}`)} sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton>
                    <IconButton onClick={() => navigate(`/admin/promotions/edit/${p.id}`)} sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton>
                    <Tooltip title="Xóa"><IconButton size="small" sx={{ color: '#d32f2f' }} onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton></Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa ưu đãi này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button sx={{ color: '#d32f2f' }} onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 