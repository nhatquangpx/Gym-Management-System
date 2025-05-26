import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Paper, Typography, Box, Button, Grid, FormControl,
  InputLabel, Select, MenuItem, Divider, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState(null);
  const [form, setForm] = useState({
    status: ''
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchOrder();
  }, [id]);
  
  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/auth/login'), 2000);
        return;
      }
      
      const response = await fetch(`http://localhost:8001/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch order');
      }
      
      const data = await response.json();
      const orderData = data.data || data;
      setOrder(orderData);
      setForm({
        status: orderData.status || ''
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Không thể tải thông tin đơn hàng: ' + error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setTimeout(() => navigate('/auth/login'), 2000);
        return;
      }
      
      // Update order status
      const statusResponse = await fetch(`http://localhost:8001/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: form.status })
      });
      
      if (!statusResponse.ok) {
        const errorData = await statusResponse.json();
        throw new Error(errorData.message || 'Failed to update order status');
      }
      
      alert('Đã lưu thay đổi!');
      navigate('/admin/orders');
    } catch (error) {
      console.error('Error updating order:', error);
      setError('Lỗi khi cập nhật đơn hàng: ' + error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '0 VND';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getPaymentMethodText = (type) => {
    switch(type) {
      case 'gym_package': return 'Gói tập';
      case 'bank_transfer': return 'Chuyển khoản';
      case 'vnpay': return 'VNPay';
      case 'momo': return 'MoMo';
      default: return type;
    }
  };

  if (loading) return (
    <Box className="flex justify-center items-center min-h-screen">
      <CircularProgress />
    </Box>
  );
  
  if (error) return (
    <Box className="p-6">
      <Paper className="p-4 mb-4 bg-red-50 text-red-800">
        <Typography>{error}</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/admin/orders')}
          startIcon={<ArrowBackIcon />}
          className="mt-4"
        >
          Quay lại
        </Button>
      </Paper>
    </Box>
  );
  
  if (!order) return (
    <Box className="p-6">
      <Paper className="p-4 mb-4">
        <Typography>Không tìm thấy đơn hàng</Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={() => navigate('/admin/orders')}
          startIcon={<ArrowBackIcon />}
          className="mt-4"
        >
          Quay lại
        </Button>
      </Paper>
    </Box>
  );
  
  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/orders')}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
          disabled={saving}
        >
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg mb-6">
        <Typography variant="h4" className="font-bold mb-6">
          Chỉnh sửa đơn hàng
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="font-medium mb-4">
                Thông tin đơn hàng
              </Typography>
              
              <Box className="mb-4">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Mã đơn hàng
                </Typography>
                <Typography variant="body1">{order._id}</Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Ngày tạo
                </Typography>
                <Typography variant="body1">{formatDate(order.createdAt)}</Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Phương thức thanh toán
                </Typography>
                <Typography variant="body1">{getPaymentMethodText(order.orderType)}</Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Tổng tiền
                </Typography>
                <Typography variant="body1">{formatCurrency(order.amount)}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="font-medium mb-4">
                Thông tin khách hàng
              </Typography>
              
              <Box className="mb-4">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Khách hàng
                </Typography>
                <Typography variant="body1">{order.userId?.name || 'N/A'}</Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body1">{order.userId?.email || 'N/A'}</Typography>
              </Box>
              
              <Box className="mb-4">
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Gói tập
                </Typography>
                <Typography variant="body1">{order.packageId?.name || 'N/A'}</Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Divider className="my-6" />
          
          <Typography variant="h6" className="font-medium mb-4">
            Cập nhật trạng thái đơn hàng
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  label="Trạng thái"
                  required
                >
                  <MenuItem value="pending">Chờ thanh toán</MenuItem>
                  <MenuItem value="paid">Đã thanh toán</MenuItem>
                  <MenuItem value="failed">Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          {order.receiptImage && (
            <>
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Hóa đơn đã tải lên
              </Typography>
              
              <Box className="mb-4">
                <a href={`http://localhost:8001${order.receiptImage}`} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={`http://localhost:8001${order.receiptImage}`} 
                    alt="Receipt" 
                    className="max-w-md rounded border"
                    style={{ maxHeight: '300px' }}
                  />
                </a>
                <Typography variant="caption" display="block" className="mt-2">
                  Ngày tải lên: {formatDate(order.receiptUploadDate)}
                </Typography>
              </Box>
            </>
          )}
        </form>
      </Paper>
    </div>
  );
} 