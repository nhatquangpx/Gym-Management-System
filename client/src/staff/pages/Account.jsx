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
    <div className="p-6">
      <Typography variant="h4" className="font-bold text-white mb-8">Tài khoản cá nhân</Typography>
      <Paper className="p-6 shadow-lg rounded-lg mb-8" style={{ background: '#232323' }}>
        <Box className="flex items-center gap-6 mb-6">
          <Avatar src={info.avatar} alt={info.name} sx={{ width: 64, height: 64 }} />
          <Typography variant="h5" className="font-bold text-white">{info.name}</Typography>
        </Box>
        <form onSubmit={handleUpdate} className="space-y-4">
          <TextField
            label="Họ tên"
            name="name"
            value={info.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            value={info.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={info.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">Cập nhật thông tin</Button>
        </form>
      </Paper>
      <Paper className="p-6 shadow-lg rounded-lg" style={{ background: '#232323' }}>
        <Typography variant="h6" className="font-bold text-white mb-4">Đổi mật khẩu</Typography>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <TextField
            label="Mật khẩu cũ"
            name="old"
            type="password"
            value={password.old}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Mật khẩu mới"
            name="new"
            type="password"
            value={password.new}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            name="confirm"
            type="password"
            value={password.confirm}
            onChange={handlePasswordChange}
            fullWidth
            margin="normal"
          />
          <Button type="submit" variant="contained" color="primary">Đổi mật khẩu</Button>
        </form>
      </Paper>
    </div>
  );
} 