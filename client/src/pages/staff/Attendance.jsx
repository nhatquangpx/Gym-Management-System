import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const mockMembers = [
  { id: 'M001', name: 'Nguyễn Văn A', packageId: 'PKG01', packageName: 'Gói 1 tháng' },
  { id: 'M002', name: 'Trần Thị B', packageId: 'PKG02', packageName: 'Gói 3 tháng' },
  { id: 'M003', name: 'Lê Văn C', packageId: 'PKG03', packageName: 'Gói 6 tháng' },
];

export default function Attendance() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setResults(
        mockMembers.filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
      );
      setLoading(false);
    }, 500);
  };

  const handleSelect = (member) => {
    setSelected(member);
    setSuccess(false);
  };

  const handleConfirm = () => {
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <Box sx={{ p: 3, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' }}>
      <Typography variant="h4" fontWeight={700} mb={3} sx={{ color: 'var(--admin-primary)', alignSelf: 'flex-start' }}>Ghi nhận buổi tập</Typography>
      <Paper sx={{ p: 3, mb: 4, display: 'flex', gap: 2, alignItems: 'center', maxWidth: 650, width: '100%', boxShadow: 4 }}>
        <TextField
          label="Tìm kiếm tên hội viên"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          fullWidth
          sx={{ fontSize: '1.15rem', background: '#fff', borderRadius: 1 }}
        />
        <Button variant="contained" size="large" 
          sx={{ minWidth: 140, fontWeight: 600, px: 2, py: 1, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }} 
          startIcon={<SearchIcon />} 
          onClick={handleSearch} 
          disabled={loading}
        >
          Tìm kiếm
        </Button>
      </Paper>
      {loading && <CircularProgress />}
      {!loading && results.length > 0 && (
        <Paper sx={{ maxWidth: 650, width: '100%', mb: 2 }}>
          <List>
            {results.map(m => (
              <ListItem button key={m.id} onClick={() => handleSelect(m)}>
                <ListItemText primary={m.name} secondary={`ID: ${m.id}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <Dialog 
        open={!!selected} 
        onClose={() => setSelected(null)}
        PaperProps={{
          sx: {
            minWidth: 370,
            maxWidth: 440,
            borderRadius: 3,
            p: 2,
            background: 'var(--admin-sidebar)',
            color: 'var(--admin-text)'
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.7rem', fontWeight: 700, textAlign: 'center', color: 'var(--admin-primary)', pb: 1 }}>
          Thông tin hội viên
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          {selected && (
            <Box>
              <Typography sx={{ mb: 1 }}><b style={{ fontWeight: 700 }}>ID hội viên:</b> {selected.id}</Typography>
              <Typography sx={{ mb: 1 }}><b style={{ fontWeight: 700 }}>Tên hội viên:</b> {selected.name}</Typography>
              <Typography sx={{ mb: 1 }}><b style={{ fontWeight: 700 }}>ID gói tập:</b> {selected.packageId}</Typography>
              <Typography sx={{ mb: 1 }}><b style={{ fontWeight: 700 }}>Tên gói tập:</b> {selected.packageName}</Typography>
              {success && <Typography color="success.main" mt={2}>Xác nhận tham gia thành công!</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setSelected(null)} disabled={confirming} sx={{ minWidth: 100 }}>Đóng</Button>
          {!success && <Button variant="contained" onClick={handleConfirm} disabled={confirming} sx={{ minWidth: 180, fontWeight: 600 }}>{confirming ? <CircularProgress size={20} /> : 'Xác nhận tham gia'}</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
} 