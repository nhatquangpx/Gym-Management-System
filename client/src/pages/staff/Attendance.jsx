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
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Ghi nhận buổi tập</Typography>
      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', maxWidth: 500 }}>
        <TextField
          label="Tìm kiếm tên hội viên"
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSearch(); }}
          fullWidth
        />
        <Button variant="contained" startIcon={<SearchIcon />} onClick={handleSearch} disabled={loading}>
          Tìm
        </Button>
      </Paper>
      {loading && <CircularProgress />}
      {!loading && results.length > 0 && (
        <Paper sx={{ maxWidth: 500, mb: 2 }}>
          <List>
            {results.map(m => (
              <ListItem button key={m.id} onClick={() => handleSelect(m)}>
                <ListItemText primary={m.name} secondary={`ID: ${m.id}`} />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
      <Dialog open={!!selected} onClose={() => setSelected(null)}>
        <DialogTitle>Thông tin hội viên</DialogTitle>
        <DialogContent>
          {selected && (
            <Box>
              <Typography><b>ID hội viên:</b> {selected.id}</Typography>
              <Typography><b>Tên hội viên:</b> {selected.name}</Typography>
              <Typography><b>ID gói tập:</b> {selected.packageId}</Typography>
              <Typography><b>Tên gói tập:</b> {selected.packageName}</Typography>
              {success && <Typography color="success.main" mt={2}>Xác nhận tham gia thành công!</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)} disabled={confirming}>Đóng</Button>
          {!success && <Button variant="contained" onClick={handleConfirm} disabled={confirming}>{confirming ? <CircularProgress size={20} /> : 'Xác nhận tham gia'}</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
} 