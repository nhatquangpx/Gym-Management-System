import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');

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

    try {
      // TODO: Implement actual login logic here
      // For now, just redirect based on role
      switch (formData.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'staff':
          navigate('/staff/dashboard');
          break;
        case 'trainer':
          navigate('/trainer/dashboard');
          break;
        default:
          setError('Invalid role selected');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
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
          <FormControl fullWidth>
            <InputLabel 
              id="role-label"
              sx={{ color: 'var(--admin-text)' }}
            >
              Vai trò
            </InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Vai trò"
              sx={{
                color: 'var(--admin-text)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }
              }}
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="staff">Staff</MenuItem>
              <MenuItem value="trainer">Trainer</MenuItem>
            </Select>
          </FormControl>

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
              '&:hover': { backgroundColor: 'var(--admin-primary-dark)' },
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