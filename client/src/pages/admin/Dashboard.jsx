import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
} from '@mui/material';
import {
  People,
  FitnessCenter,
  ShoppingCart,
  AttachMoney,
  TrendingUp,
  MoreVert,
} from '@mui/icons-material';

export default function Dashboard() {
  const stats = [
    {
      title: 'Tổng thành viên',
      value: '150',
      icon: <People sx={{ fontSize: 40, color: 'var(--admin-primary)' }} />,
      trend: '+10%',
      color: 'var(--admin-primary)',
    },
    {
      title: 'Gói tập đang hoạt động',
      value: '3',
      icon: <FitnessCenter sx={{ fontSize: 40, color: 'var(--admin-primary)' }} />,
      trend: '0%',
      color: 'var(--admin-text)',
    },
    {
      title: 'Đơn hàng mới',
      value: '12',
      icon: <ShoppingCart sx={{ fontSize: 40, color: 'var(--admin-primary)' }} />,
      trend: '+5%',
      color: 'var(--admin-primary)',
    },
    {
      title: 'Doanh thu tháng',
      value: '15.000.000đ',
      icon: <AttachMoney sx={{ fontSize: 40, color: 'var(--admin-primary)' }} />,
      trend: '+20%',
      color: 'var(--admin-primary)',
    },
  ];

  return (
    <Box sx={{ p: 3, background: 'var(--admin-bg)', minHeight: '100vh' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', mb: 4 }}>
        Tổng quan
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex' }}>
            <Card sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderLeft: `4px solid ${stat.color}`, width: '100%', minWidth: 0 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6" color="var(--admin-text)" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ color: 'var(--admin-text)', fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <TrendingUp sx={{ color: stat.color, mr: 1 }} />
                      <Typography variant="body2" sx={{ color: stat.color, fontWeight: 600 }}>
                        {stat.trend}
                      </Typography>
                    </Box>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
            <CardHeader
              title={<span style={{ color: 'var(--admin-text)', fontWeight: 600 }}>Hoạt động gần đây</span>}
              action={
                <IconButton>
                  <MoreVert sx={{ color: 'var(--admin-primary)' }} />
                </IconButton>
              }
              sx={{ borderBottom: '1px solid var(--admin-border)' }}
            />
            <Divider sx={{ borderColor: 'var(--admin-border)' }} />
            <CardContent>
              {/* Thêm danh sách hoạt động gần đây ở đây */}
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
            <CardHeader
              title={<span style={{ color: 'var(--admin-text)', fontWeight: 600 }}>Thống kê doanh thu</span>}
              action={
                <IconButton>
                  <MoreVert sx={{ color: 'var(--admin-primary)' }} />
                </IconButton>
              }
              sx={{ borderBottom: '1px solid var(--admin-border)' }}
            />
            <Divider sx={{ borderColor: 'var(--admin-border)' }} />
            <CardContent>
              {/* Thêm biểu đồ doanh thu ở đây */}
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 