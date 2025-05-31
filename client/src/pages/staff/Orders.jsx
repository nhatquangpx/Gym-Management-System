import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchPackage, setSearchPackage] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchPaymentMethod, setSearchPaymentMethod] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để xem danh sách đơn hàng.');
        setLoading(false);
        return;
      }
      
      const response = await fetch('http://localhost:8001/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data.data || data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Không thể tải danh sách đơn hàng: ' + error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/auth/login'), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
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
      
      const response = await fetch(`http://localhost:8001/api/orders/${itemToDelete}/status`, {
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
      
      fetchOrders();
      alert('Đã hủy đơn hàng thành công!');
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
      setItemToDelete(null);
    }
  };
  
  // Lọc danh sách đơn hàng theo khách hàng, gói tập, trạng thái, phương thức thanh toán
  const filteredOrders = orders.filter(o => {
    const customerName = o.userId?.name || '';
    const packageName = o.packageId?.name || '';
    const orderStatus = o.status || '';
    const paymentMethod = o.orderType || '';
    
    return customerName.toLowerCase().includes(searchCustomer.toLowerCase()) &&
      packageName.toLowerCase().includes(searchPackage.toLowerCase()) &&
      orderStatus.toLowerCase().includes(searchStatus.toLowerCase()) &&
      paymentMethod.toLowerCase().includes(searchPaymentMethod.toLowerCase());
  });
  
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
  
  const getPaymentMethodText = (type) => {
    switch(type) {
      case 'gym_package': return 'Gói tập';
      case 'bank_transfer': return 'Chuyển khoản';
      case 'vnpay': return 'VNPay';
      case 'momo': return 'MoMo';
      default: return type;
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
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', marginBottom: 32 }}>
          Danh sách đơn hàng
        </h1>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Thanh tìm kiếm */}
      <Paper sx={{ p: 2, mb: 6, background: '#fff' }}>
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Tìm kiếm khách hàng"
            className="p-2 rounded border border-gray-300 min-w-[200px] text-[var(--admin-text)] placeholder:text-[var(--admin-text)]"
            value={searchCustomer}
            onChange={e => setSearchCustomer(e.target.value)}
          />
          <input
            type="text"
            placeholder="Tìm kiếm gói tập"
            className="p-2 rounded border border-gray-300 min-w-[120px] text-[var(--admin-text)] placeholder:text-[var(--admin-text)]"
            value={searchPackage}
            onChange={e => setSearchPackage(e.target.value)}
          />
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
            <Select
              value={searchStatus}
              label="Trạng thái"
              onChange={e => setSearchStatus(e.target.value)}
              sx={{ color: 'var(--admin-text)' }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="pending">Chờ thanh toán</MenuItem>
              <MenuItem value="paid">Đã thanh toán</MenuItem>
              <MenuItem value="failed">Đã hủy</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Phương thức thanh toán</InputLabel>
            <Select
              value={searchPaymentMethod}
              label="Phương thức thanh toán"
              onChange={e => setSearchPaymentMethod(e.target.value)}
              sx={{ color: 'var(--admin-text)' }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="gym_package">Gói tập</MenuItem>
              <MenuItem value="bank_transfer">Chuyển khoản</MenuItem>
              <MenuItem value="vnpay">VNPay</MenuItem>
              <MenuItem value="momo">MoMo</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Khách hàng</th>
                <th className="py-3 px-4 text-center">Gói tập</th>
                <th className="py-3 px-4 text-center">Tổng tiền</th>
                <th className="py-3 px-4 text-center">Phương thức</th>
                <th className="py-3 px-4 text-center">Ngày tạo</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-4">Đang tải...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4">Không có đơn hàng nào</td></tr>
              ) : filteredOrders.map((o) => (
                <tr key={o._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 flex items-center gap-3 text-[var(--admin-text)] justify-center text-center">
                    <div>
                      <div className="font-medium">{o.userId?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{o.userId?.email || 'N/A'}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--admin-text)]">
                    {o.packageId?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--admin-text)]">
                    {formatCurrency(o.amount)}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--admin-text)]">
                    {getPaymentMethodText(o.orderType)}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--admin-text)]">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Chip
                      label={getStatusText(o.status)}
                      color={getStatusColor(o.status)}
                      size="small"
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <Tooltip title="Xem chi tiết">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/staff/orders/view/${o._id}`)}
                          sx={{ color: 'var(--admin-primary)' }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          size="small"
                          onClick={() => navigate(`/staff/orders/edit/${o._id}`)}
                          sx={{ color: 'var(--admin-text)' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {o.status === 'pending' && (
                        <Tooltip title="Hủy đơn hàng">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(o._id)}
                            sx={{ color: '#d32f2f' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
} 