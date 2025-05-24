import {
  Box,
  Paper,
  Typography,
  Avatar,
  Grid,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  Edit,
  Save,
} from '@mui/icons-material';

export default function Profile() {
  const user = {
    name: 'Nguyễn Văn Admin',
    email: 'admin@gym.com',
    phone: '0901234567',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    joinDate: '01/01/2023',
    role: 'Quản trị viên',
    avatar: 'https://i.pravatar.cc/150?img=1',
  };

  return (
    <Box sx={{ p: 3, background: '#181818', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', mb: 4 }}>
        Thông tin cá nhân
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 4, boxShadow: 6, background: '#232323', color: '#fff' }}>
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2, border: '4px solid #e53935', boxShadow: '0 4px 24px #e5393533' }}
            />
            <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 700 }}>
              {user.name}
            </Typography>
            <Typography variant="body1" color="#e53935" gutterBottom sx={{ fontWeight: 600 }}>
              {user.role}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<Edit />}
              sx={{ mt: 2, color: '#e53935', borderColor: '#e53935', '&:hover': { borderColor: '#e53935', background: '#1f1f1f' } }}
            >
              Chỉnh sửa ảnh
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 6, background: '#232323', color: '#fff' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Thông tin chi tiết</Typography>
              <Button
                variant="contained"
                startIcon={<Save />}
                sx={{ bgcolor: '#e53935', fontWeight: 700, '&:hover': { bgcolor: '#b71c1c' } }}
              >
                Lưu thay đổi
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  defaultValue={user.name}
                  InputProps={{
                    startAdornment: (
                      <Person sx={{ mr: 1, color: '#e53935' }} />
                    ),
                  }}
                  sx={{ input: { color: '#fff' }, label: { color: '#D4D4D4' }, bgcolor: '#181818', borderRadius: 2, mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  defaultValue={user.email}
                  InputProps={{
                    startAdornment: (
                      <Email sx={{ mr: 1, color: '#e53935' }} />
                    ),
                  }}
                  sx={{ input: { color: '#fff' }, label: { color: '#D4D4D4' }, bgcolor: '#181818', borderRadius: 2, mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  defaultValue={user.phone}
                  InputProps={{
                    startAdornment: (
                      <Phone sx={{ mr: 1, color: '#e53935' }} />
                    ),
                  }}
                  sx={{ input: { color: '#fff' }, label: { color: '#D4D4D4' }, bgcolor: '#181818', borderRadius: 2, mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  defaultValue={user.address}
                  InputProps={{
                    startAdornment: (
                      <LocationOn sx={{ mr: 1, color: '#e53935' }} />
                    ),
                  }}
                  sx={{ input: { color: '#fff' }, label: { color: '#D4D4D4' }, bgcolor: '#181818', borderRadius: 2, mb: 2 }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3, borderColor: '#333' }} />

            <List>
              <ListItem>
                <ListItemIcon>
                  <CalendarToday sx={{ color: '#e53935' }} />
                </ListItemIcon>
                <ListItemText
                  primary={<span style={{ color: '#fff', fontWeight: 600 }}>Ngày tham gia</span>}
                  secondary={<span style={{ color: '#D4D4D4' }}>{user.joinDate}</span>}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 