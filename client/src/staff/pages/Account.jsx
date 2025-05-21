import { useState } from 'react';
import { Paper, Typography, Box, TextField, Button, Avatar } from '@mui/material';

export default function StaffAccount() {
  // Giả lập thông tin cá nhân, sau này lấy từ context hoặc API
  const [info, setInfo] = useState({
    name: 'Quản lý Gym',
    email: 'manager@gympro.vn',
    phone: '0901234567',
    avatar: 'https://i.pravatar.cc/150?img=12',
  });
  const [password, setPassword] = useState({ old: '', new: '', confirm: '' });

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const handleUpdate = (e) => {
    e.preventDefault();
    // TODO: Gọi API cập nhật thông tin
    alert('Cập nhật thông tin thành công!');
  };
  const handleChangePassword = (e) => {
    e.preventDefault();
    // TODO: Gọi API đổi mật khẩu
    if (password.new !== password.confirm) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    alert('Đổi mật khẩu thành công!');
  };

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
      <Typography variant="h4" className="font-bold mb-8" sx={{ color: 'var(--admin-text)' }}>Tài khoản cá nhân</Typography>
      <Paper className="p-6 shadow-lg rounded-lg mb-8" sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex items-center gap-6 mb-6">
          <Avatar src={info.avatar} alt={info.name} sx={{ width: 64, height: 64 }} />
          <Typography variant="h5" className="font-bold" sx={{ color: 'var(--admin-text)' }}>{info.name}</Typography>
        </Box>
        <form onSubmit={handleUpdate} className="space-y-4">
          <TextField
            label="Họ tên"
            name="name"
            value={info.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            label="Email"
            name="email"
            value={info.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={info.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <Button type="submit" variant="contained" sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary-dark)' } }}>Cập nhật thông tin</Button>
        </form>
      </Paper>
      <Paper className="p-6 shadow-lg rounded-lg" sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Typography variant="h6" className="font-bold mb-4" sx={{ color: 'var(--admin-text)' }}>Đổi mật khẩu</Typography>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <TextField
            label="Mật khẩu cũ"
            name="old"
            type="password"
            value={password.old}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            label="Mật khẩu mới"
            name="new"
            type="password"
            value={password.new}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            name="confirm"
            type="password"
            value={password.confirm}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <Button type="submit" variant="contained" sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary-dark)' } }}>Đổi mật khẩu</Button>
        </form>
      </Paper>
    </div>
  );
} 