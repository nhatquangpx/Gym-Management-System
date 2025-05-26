import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import StatusBadge from "../../components/features/admin/StatusBadge/StatusBadge";
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchPackage, setSearchPackage] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.data || data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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
      const response = await fetch(`/api/orders/${itemToDelete}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      
      fetchOrders();
      alert('Đã hủy đơn hàng thành công!');
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Lỗi khi hủy đơn hàng: ' + error.message);
    } finally {
      setOpenConfirm(false);
      setItemToDelete(null);
    }
  };
  
  // Lọc danh sách đơn hàng theo khách hàng, gói tập, trạng thái
  const filteredOrders = orders.filter(o => {
    const customerName = o.userId?.name || '';
    const packageName = o.packageId?.name || '';
    const orderStatus = o.status || '';
    
    return customerName.toLowerCase().includes(searchCustomer.toLowerCase()) &&
      packageName.toLowerCase().includes(searchPackage.toLowerCase()) &&
      orderStatus.toLowerCase().includes(searchStatus.toLowerCase());
  });
  
  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };
  
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', marginBottom: 32 }}>
          Danh sách đơn hàng
        </h1>
      </div>
      {/* Thanh tìm kiếm */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Khách hàng"
          className="p-2 rounded border border-gray-300 min-w-[200px]"
          value={searchCustomer}
          onChange={e => setSearchCustomer(e.target.value)}
        />
        <input
          type="text"
          placeholder="Gói tập"
          className="p-2 rounded border border-gray-300 min-w-[120px]"
          value={searchPackage}
          onChange={e => setSearchPackage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Trạng thái"
          className="p-2 rounded border border-gray-300 min-w-[120px]"
          value={searchStatus}
          onChange={e => setSearchStatus(e.target.value)}
        />
      </div>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Khách hàng</th>
                <th className="py-3 px-4 text-center">Gói tập</th>
                <th className="py-3 px-4 text-center">Tổng tiền</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-4">Đang tải...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">Không có đơn hàng nào</td></tr>
              ) : filteredOrders.map((o) => (
                <tr key={o._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 flex items-center gap-3 text-[var(--admin-text)] justify-center text-center">
                    <ShoppingCartIcon className="text-[var(--admin-primary)]" />
                    <span>{o.userId?.name || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{o.packageId?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{o.totalAmount}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{getStatusText(o.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/admin/orders/view/${o._id}`}><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/admin/orders/edit/${o._id}`}><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Hủy đơn hàng"><IconButton size="small" sx={{ color: 'var(--admin-primary)' }} onClick={() => handleDelete(o._id)}><DeleteIcon /></IconButton></Tooltip>
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
        <DialogContent>Bạn có chắc chắn muốn hủy đơn hàng này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Không</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Có, hủy đơn hàng</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 