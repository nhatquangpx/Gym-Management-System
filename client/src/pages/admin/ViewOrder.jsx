import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  LocalShipping as ShippingIcon,
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";

const ViewOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);

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
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Không thể tải thông tin đơn hàng');
        }
        
        if (!data.success) {
          throw new Error(data.message || 'Không thể tải thông tin đơn hàng');
        }
        
        setOrder(data.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError(error.message || 'Không thể tải thông tin đơn hàng');
        
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

  const handleDelete = () => {
    setOpenConfirm(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch(`http://localhost:8001/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'failed' })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel order');
      }
      
      alert('Đã hủy đơn hàng thành công!');
      navigate('/admin/orders');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Lỗi khi hủy đơn hàng: ' + error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    } finally {
      setOpenConfirm(false);
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
    <div className="p-6 bg-[var(--admin-bg)]">
      <Box className="flex justify-between items-center mb-6">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/orders')}
          sx={{ color: 'var(--admin-primary)', borderColor: 'var(--admin-primary)' }}
        >
          Quay lại
        </Button>
        <Box className="flex gap-2">
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/admin/orders/edit/${id}`)}
            sx={{ 
              bgcolor: 'var(--admin-primary)',
              '&:hover': {
                bgcolor: 'var(--admin-primary-dark)'
              }
            }}
          >
            Chỉnh sửa
          </Button>
          {order.status === 'pending' && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Hủy đơn hàng
            </Button>
          )}
        </Box>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg mb-6" sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex justify-between items-center mb-6">
          <Typography variant="h4" className="font-bold" sx={{ color: 'var(--admin-primary)' }}>
            Chi tiết đơn hàng
          </Typography>
          <Chip
            label={getStatusText(order.status)}
            color={getStatusColor(order.status)}
          />
        </Box>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-medium mb-4" sx={{ color: 'var(--admin-primary)' }}>
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
                Tổng tiền
              </Typography>
              <Typography variant="body1">{formatCurrency(order.amount)}</Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h6" className="font-medium mb-4" sx={{ color: 'var(--admin-primary)' }}>
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
                Số điện thoại
              </Typography>
              <Typography variant="body1">{order.userId?.phone || 'N/A'}</Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider className="my-4" sx={{ borderColor: 'var(--admin-border)' }} />
            <Typography variant="h6" className="font-medium mb-4" sx={{ color: 'var(--admin-primary)' }}>
              Thông tin gói tập
            </Typography>
            
            <Box className="mb-4">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Tên gói
              </Typography>
              <Typography variant="body1">{order.packageId?.name || 'N/A'}</Typography>
            </Box>
            
            <Box className="mb-4">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Mô tả
              </Typography>
              <Typography variant="body1">{order.packageId?.description || 'N/A'}</Typography>
            </Box>
            
            <Box className="mb-4">
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Thời hạn
              </Typography>
              <Typography variant="body1">{order.packageId?.duration || 'N/A'} tháng</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận hủy đơn hàng</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn hủy đơn hàng này?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ViewOrder; 