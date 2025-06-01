import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Attendance() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState([]); // Store all members
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [option, setOption] = useState('checkin');
  const [checkedIn, setCheckedIn] = useState(false); // trạng thái đã checkin chưa

  // Fetch all members when component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8001/api/employees/members', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        
        if (data.success) {
          // Transform the data to match our component's structure
          const formattedMembers = data.data.map(member => ({
            id: member.memberId,
            name: member.memberName,
            packageId: member.packageId,
            packageName: member.packageName,
          }));
          setMembers(formattedMembers);
        } else {
          setError('Không thể tải danh sách hội viên');
        }
      } catch (err) {
        setError('Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleSearch = () => {
    if (!search.trim()) {
      setResults([]);
      return;
    }
    
    setLoading(true);
    // Filter from loaded members
    const filtered = members.filter(m => 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.phone?.includes(search) ||
      m.email?.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filtered);
    setLoading(false);
  };

  const handleSelect = async (member) => {
    setSelected(member);
    setSuccess(false);
    setError('');
    setOption('checkin');
    // Kiểm tra trạng thái đã checkin chưa
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:8001/api/employees/checkin-status/${member.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCheckedIn(!!data.checkedIn); // true nếu đã checkin hôm nay
    } catch {
      setCheckedIn(false);
    }
  };

  const handleConfirm = async () => {
    if (!selected) return;
    setError('');
    setSuccess(false);
    setConfirming(true);
    const token = localStorage.getItem('token');
    try {
      if (option === 'checkin') {
        const response = await fetch(`http://localhost:8001/api/employees/checkin/${selected.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setSuccess(true);
          setCheckedIn(true);
        } else {
          setError(data.message || 'Điểm danh thất bại');
        }
      } else if (option === 'checkout') {
        if (!checkedIn) {
          setError('Bạn cần checkin trước khi checkout!');
          setConfirming(false);
          return;
        }
        const response = await fetch(`http://localhost:8001/api/employees/checkout/${selected.id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        const data = await response.json();
        if (data.success) {
          setSuccess(true);
          setCheckedIn(false);
        } else {
          setError(data.message || 'Checkout thất bại');
        }
      }
    } catch (err) {
      setError('Lỗi kết nối server');
    } finally {
      setConfirming(false);
    }
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
              <FormControl fullWidth sx={{ mt: 2, mb: 1 }}>
                <InputLabel id="option-label">Tuỳ chọn</InputLabel>
                <Select
                  labelId="option-label"
                  value={option}
                  label="Tuỳ chọn"
                  onChange={e => setOption(e.target.value)}
                >
                  <MenuItem value="checkin">Checkin</MenuItem>
                  <MenuItem value="checkout">Checkout</MenuItem>
                </Select>
              </FormControl>
              {error && <Typography color="error" mt={2}>{error}</Typography>}
              {success && <Typography color="success.main" mt={2}>{option === 'checkin' ? 'Checkin thành công!' : 'Checkout thành công!'}</Typography>}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={() => setSelected(null)} disabled={confirming} sx={{ minWidth: 100 }}>Đóng</Button>
          {!success && <Button variant="contained" onClick={handleConfirm} disabled={confirming} sx={{ minWidth: 180, fontWeight: 600 }}>{confirming ? <CircularProgress size={20} /> : 'Xác nhận'}</Button>}
        </DialogActions>
      </Dialog>
    </Box>
  );
}