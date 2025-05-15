import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect } from 'react';
import StatusBadge from '../components/StatusBadge/StatusBadge';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setOrders(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);  // Helper function to map status to a display format
  const mapStatus = (status) => {
    switch(status) {
      case 'pending': return 'Chờ thanh toán';
      case 'paid': return 'Đã thanh toán';
      case 'failed': return 'Thanh toán thất bại';
      default: return status;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="bg-[#181818] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Quản lý đơn hàng</h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <CircularProgress sx={{ color: '#e53935' }} />
        </div>
      ) : error ? (
        <div className="bg-[#2a2020] p-4 rounded-lg text-red-400 text-center">
          {error}
        </div>
      ) : (
        <Paper sx={{ background: '#232323', color: '#fff', borderRadius: 4, boxShadow: 6 }}>
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-2xl">
              <thead>
                <tr className="bg-[#1f1f1f] text-[#e53935]">
                  <th className="py-3 px-4 text-left">Khách hàng</th>
                  <th className="py-3 px-4 text-left">Gói tập</th>
                  <th className="py-3 px-4 text-left">Phương thức</th>
                  <th className="py-3 px-4 text-left">Tổng tiền</th>
                  <th className="py-3 px-4 text-left">Trạng thái</th>
                  <th className="py-3 px-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((o) => (
                    <tr key={o._id} className="border-b border-[#333] hover:bg-[#252525] transition rounded-xl">
                      <td className="py-2 px-4 flex items-center gap-3 text-white">
                        <ShoppingCartIcon className="text-[#e53935]" />
                        <span>{o.userId.name || o.userId.email || 'N/A'}</span>
                      </td>
                      <td className="py-2 px-4 text-[#D4D4D4]">{o.packageId.name}</td>
                      <td className="py-2 px-4 text-[#D4D4D4]">
                        {o.orderType === 'bank_transfer' 
                          ? 'Chuyển khoản' 
                          : o.orderType === 'momo' 
                            ? 'MoMo' 
                            : 'VNPAY'}
                      </td>
                      <td className="py-2 px-4 text-[#D4D4D4]">{formatCurrency(o.amount)}</td>
                      <td className="py-2 px-4">
                        <StatusBadge status={mapStatus(o.status)} />
                      </td>
                      <td className="py-2 px-4 text-center">
                        <div className="flex gap-2 justify-center">
                          <Tooltip title="Xem chi tiết"><Link to={`/orders/view/${o._id}`}><IconButton size="small" sx={{ color: '#e53935' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                          <Tooltip title="Chỉnh sửa"><Link to={`/orders/edit/${o._id}`}><IconButton size="small" sx={{ color: '#D4D4D4' }}><EditIcon /></IconButton></Link></Tooltip>
                          <Tooltip title="Xóa"><IconButton size="small" sx={{ color: '#e53935' }}><DeleteIcon /></IconButton></Tooltip>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Paper>
      )}
    </div>
  );
} 