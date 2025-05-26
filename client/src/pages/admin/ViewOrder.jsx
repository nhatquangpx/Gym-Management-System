import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Paper, Typography, Box, Button, Chip, Grid, Divider, Card, CardContent } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';

export default function ViewOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
        setOrder(data.data || data);
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
    
    fetchOrder();
  }, [id, navigate]);

  const getStatusText = (status) => {
    switch(status) {
      case 'paid': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'failed': return 'Đã hủy';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <CheckCircleIcon color="success" />;
      case 'pending': return <PendingIcon color="warning" />;
      case 'failed': return <CancelIcon color="error" />;
      default: return null;
    }
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

  const getPaymentMethodIcon = (type) => {
    switch(type) {
      case 'gym_package': return <PaymentIcon />;
      case 'bank_transfer': return <AccountBalanceIcon />;
      case 'vnpay': 
      case 'momo': 
        return <CreditCardIcon />;
      default: return <PaymentIcon />;
    }
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

  const formatCurrency = (amount) => {
    if (!amount) return '0 VND';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) return <div className="text-[var(--admin-text)] p-6">Đang tải...</div>;
  if (error) return <div className="text-[var(--admin-text)] p-6 bg-red-100 border border-red-400 rounded">{error}</div>;
  if (!order) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy đơn hàng.</div>;
  
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
          startIcon={<EditIcon />}
          onClick={() => navigate(`/admin/orders/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg mb-6">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h4" className="font-bold">
            Chi tiết đơn hàng
          </Typography>
          <Chip 
            icon={getStatusIcon(order.status)}
            label={getStatusText(order.status)}
            color={getStatusColor(order.status)}
          />
        </Box>
        
        <Divider className="my-4" />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-medium mb-4">
              Thông tin đơn hàng
            </Typography>
            
            <Box className="mb-2">
              <Typography variant="subtitle2" color="text.secondary">Mã đơn hàng</Typography>
              <Typography variant="body1">{order._id}</Typography>
            </Box>
            
            <Box className="mb-2">
              <Typography variant="subtitle2" color="text.secondary">Ngày tạo</Typography>
              <Typography variant="body1">{formatDate(order.createdAt)}</Typography>
            </Box>
            
            <Box className="mb-2">
              <Typography variant="subtitle2" color="text.secondary">Phương thức thanh toán</Typography>
              <Box className="flex items-center gap-2">
                {getPaymentMethodIcon(order.orderType)}
                <Typography variant="body1">{getPaymentMethodText(order.orderType)}</Typography>
              </Box>
            </Box>

            {order.receiptImage && (
              <Box className="mb-2">
                <Typography variant="subtitle2" color="text.secondary">Hóa đơn</Typography>
                <a href={`http://localhost:8001${order.receiptImage}`} target="_blank" rel="noopener noreferrer">
                  <img 
                    src={`http://localhost:8001${order.receiptImage}`} 
                    alt="Receipt" 
                    className="mt-2 max-w-xs rounded border"
                    style={{ maxHeight: '150px' }}
                  />
                </a>
                <Typography variant="caption" display="block">
                  Ngày tải lên: {formatDate(order.receiptUploadDate)}
                </Typography>
              </Box>
            )}
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-medium mb-4">
              Thông tin khách hàng
            </Typography>
            
            <Box className="mb-2">
              <Typography variant="subtitle2" color="text.secondary">Khách hàng</Typography>
              <Typography variant="body1">{order.userId?.name || 'N/A'}</Typography>
            </Box>
            
            <Box className="mb-2">
              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{order.userId?.email || 'N/A'}</Typography>
            </Box>
            
            <Box className="mb-2">
              <Typography variant="subtitle2" color="text.secondary">Số điện thoại</Typography>
              <Typography variant="body1">{order.userId?.phone || 'N/A'}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider className="my-4" />

        <Typography variant="h6" className="font-medium mb-4">
          Chi tiết gói tập
        </Typography>
        
        <Card variant="outlined" className="mb-4">
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography variant="h6">{order.packageId?.name || 'N/A'}</Typography>
                <Typography variant="body2" color="text.secondary" className="mb-2">
                  {order.packageId?.description || 'Không có mô tả'}
                </Typography>
                {order.packageId?.duration && (
                  <Typography variant="body2">
                    Thời hạn: {order.packageId.duration} tháng
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={4} className="flex justify-end items-center">
                <Typography variant="h5" color="primary">
                  {formatCurrency(order.amount)}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {(order.orderType === 'vnpay' && order.vnp_TransactionNo) && (
          <>
            <Divider className="my-4" />
            <Typography variant="h6" className="font-medium mb-4">
              Thông tin thanh toán VNPay
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box className="mb-2">
                  <Typography variant="subtitle2" color="text.secondary">Mã giao dịch</Typography>
                  <Typography variant="body1">{order.vnp_TransactionNo || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className="mb-2">
                  <Typography variant="subtitle2" color="text.secondary">Mã tham chiếu</Typography>
                  <Typography variant="body1">{order.vnp_TxnRef || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className="mb-2">
                  <Typography variant="subtitle2" color="text.secondary">Ngày thanh toán</Typography>
                  <Typography variant="body1">{order.vnp_PayDate || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box className="mb-2">
                  <Typography variant="subtitle2" color="text.secondary">Nội dung</Typography>
                  <Typography variant="body1">{order.vnp_OrderInfo || 'N/A'}</Typography>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Paper>
    </div>
  );
} 