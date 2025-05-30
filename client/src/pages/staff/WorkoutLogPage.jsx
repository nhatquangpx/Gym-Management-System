import React, { useState } from 'react';
import {
  Paper, Typography, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import styles from '../trainer/WorkoutLogPage/WorkoutLogPage.module.css';

export default function StaffWorkoutLogPage() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [packageInfo, setPackageInfo] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState('');

  // Tìm kiếm hội viên
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/members?name=${encodeURIComponent(search)}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setResults(data);
      } else if (Array.isArray(data.data)) {
        setResults(data.data);
      } else {
        setResults([]);
      }
    } catch (err) {
      setError('Lỗi khi tìm kiếm hội viên.');
    }
    setLoading(false);
  };

  // Khi chọn hội viên, lấy thông tin gói tập
  const handleSelectMember = async (member) => {
    setSelectedMember(member);
    setPackageInfo(null);
    setPopupOpen(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/members/${member._id}/package-status`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      const data = await res.json();
      if (data.success && data.data && data.data.currentPackage) {
        setPackageInfo(data.data.currentPackage);
      } else {
        setPackageInfo(null);
      }
    } catch (err) {
      setPackageInfo(null);
    }
  };

  // Xác nhận tham gia buổi tập
  const handleConfirm = async () => {
    // TODO: Gọi API xác nhận ghi nhận buổi tập nếu có
    setPopupOpen(false);
    setSnackbar({ open: true, message: 'Xác nhận tham gia thành công!', severity: 'success' });
  };

  return (
    <Box className="min-h-screen p-6 bg-[var(--admin-bg)]">
      <Typography variant="h4" className="font-bold" sx={{ color: '#4f8cff', fontWeight: 700, fontSize: '2.2em', mb: 4 }}>
        Ghi nhận buổi tập
      </Typography>
      <Paper className="p-4 mb-6" sx={{ background: 'var(--admin-sidebar)' }}>
        <form onSubmit={handleSearch} className="flex gap-4 items-center">
          <TextField
            label="Tìm kiếm hội viên theo tên"
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ minWidth: 260 }}
            onKeyDown={e => { if (e.key === 'Enter') handleSearch(e); }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            startIcon={<SearchIcon />}
            disabled={loading}
            sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary-dark)' } }}
          >
            Tìm kiếm
          </Button>
        </form>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Paper>
      {results.length > 0 && (
        <TableContainer component={Paper} sx={{ background: 'var(--admin-sidebar)', mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: 'var(--admin-header)' }}>
                <TableCell sx={{ color: 'var(--admin-primary)' }}>ID</TableCell>
                <TableCell sx={{ color: 'var(--admin-primary)' }}>Tên hội viên</TableCell>
                <TableCell sx={{ color: 'var(--admin-primary)' }}>Email</TableCell>
                <TableCell sx={{ color: 'var(--admin-primary)' }}>Số điện thoại</TableCell>
                <TableCell sx={{ color: 'var(--admin-primary)' }}>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map(m => (
                <TableRow key={m._id} hover>
                  <TableCell>{m._id}</TableCell>
                  <TableCell>{m.name}</TableCell>
                  <TableCell>{m.email}</TableCell>
                  <TableCell>{m.phone}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleSelectMember(m)}>
                      Chọn
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* Popup xác nhận */}
      <Dialog open={popupOpen} onClose={() => setPopupOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, color: 'var(--admin-primary)' }}>Xác nhận tham gia buổi tập</DialogTitle>
        <DialogContent>
          {selectedMember && (
            <Box sx={{ mb: 2 }}>
              <Typography><b>ID Member:</b> {selectedMember._id}</Typography>
              <Typography><b>Tên Member:</b> {selectedMember.name}</Typography>
            </Box>
          )}
          {packageInfo ? (
            <Box sx={{ mb: 2 }}>
              <Typography><b>ID gói tập:</b> {packageInfo._id}</Typography>
              <Typography><b>Tên gói tập:</b> {packageInfo.name}</Typography>
            </Box>
          ) : (
            <Typography color="error">Không tìm thấy gói tập hiện tại của hội viên này.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPopupOpen(false)} color="secondary">Hủy</Button>
          <Button onClick={handleConfirm} variant="contained" color="primary" sx={{ backgroundColor: 'var(--admin-primary)' }}>
            Xác nhận tham gia
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 