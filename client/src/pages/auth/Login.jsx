import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../../redux/slices/authSlice';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại');
      }

      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Dispatch login action to Redux
      dispatch(setLogin({
        user: data.user,
        token: data.token
      }));

      // Chuyển hướng dựa vào role
      switch (data.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'employee':
          navigate('/staff/dashboard');
          break;
        case 'trainer':
          navigate('/trainer/dashboard');
          break;
        default:
          setError('Vai trò không hợp lệ');
      }
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--admin-bg)' }}>
      <Paper 
        elevation={3} 
        className="p-8 w-full max-w-md"
        sx={{ 
          backgroundColor: 'var(--admin-sidebar)',
          color: 'var(--admin-text)'
        }}
      >
        <Box className="flex flex-col items-center mb-6">
          <LockOutlinedIcon 
            sx={{ 
              fontSize: 40,
              color: 'var(--admin-primary)',
              marginBottom: 2
            }} 
          />
          <Typography 
            variant="h4" 
            component="h1" 
            className="font-bold"
            sx={{ color: 'var(--admin-text)' }}
          >
            Đăng nhập
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />

          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              backgroundColor: 'var(--admin-primary)',
              color: '#fff',
              fontWeight: 700,
              '&:hover': {
                backgroundColor: '#2563eb',
                color: '#fff',
                opacity: 0.95
              },
              marginTop: 2
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Đăng nhập'}
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Login;