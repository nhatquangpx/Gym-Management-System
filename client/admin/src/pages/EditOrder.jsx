import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/Button/Button';
import CircularProgress from '@mui/material/CircularProgress';
import BankTransferDetails from '../components/BankTransferDetails/BankTransferDetails';

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    status: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setOrder(data.data);
          setForm({
            status: data.data.status
          });
        } else {
          throw new Error(data.message || 'Failed to fetch order');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: form.status })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Đã cập nhật trạng thái đơn hàng thành công!');
        navigate('/orders');
      } else {
        throw new Error(data.message || 'Failed to update order');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert(`Lỗi khi cập nhật: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="bg-[#181818] min-h-screen p-6 text-white flex justify-center items-center">
        <CircularProgress sx={{ color: '#e53935' }} />
      </div>
    );
  }
  
  if (error || !order) {
    return (
      <div className="bg-[#181818] min-h-screen p-6 text-white">
        <div className="bg-[#2a2020] p-4 rounded-lg text-red-400 text-center">
          {error || 'Không tìm thấy đơn hàng.'}
        </div>
        <div className="mt-4 text-center">
          <Link to="/orders"><Button type="button">Quay lại</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#232323] rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-[#444]">Chi tiết đơn hàng</h2>
          
          <div className="mb-4">
            <label className="block mb-1 text-gray-400">Mã đơn hàng</label>
            <div className="p-2 rounded bg-[#181818] border border-[#444]">
              {order._id}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-gray-400">Khách hàng</label>
            <div className="p-2 rounded bg-[#181818] border border-[#444]">
              {order.userId.name || order.userId.email || 'N/A'}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-gray-400">Email</label>
            <div className="p-2 rounded bg-[#181818] border border-[#444]">
              {order.userId.email || 'N/A'}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-gray-400">Gói tập</label>
            <div className="p-2 rounded bg-[#181818] border border-[#444]">
              {order.packageId.name}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-gray-400">Tổng tiền</label>
            <div className="p-2 rounded bg-[#181818] border border-[#444]">
              {formatCurrency(order.amount)}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-gray-400">Phương thức thanh toán</label>
            <div className="p-2 rounded bg-[#181818] border border-[#444]">
              {order.orderType === 'bank_transfer' 
                ? 'Chuyển khoản ngân hàng' 
                : order.orderType === 'momo' 
                  ? 'Ví MoMo' 
                  : 'Thẻ qua VNPAY'}
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-gray-400">Ngày tạo</label>
            <div className="p-2 rounded bg-[#181818] border border-[#444]">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
          
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1 text-gray-400">Trạng thái</label>
              <select 
                name="status" 
                value={form.status} 
                onChange={handleChange} 
                className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]"
              >
                <option value="pending">Chờ thanh toán</option>
                <option value="paid">Đã thanh toán</option>
                <option value="failed">Thanh toán thất bại</option>
              </select>
            </div>
            
            <div className="flex gap-3">
              <Button type="submit" disabled={saving}>
                {saving ? 'Đang lưu...' : 'Cập nhật trạng thái'}
              </Button>
              <Link to="/orders"><Button type="button">Quay lại</Button></Link>
            </div>
          </form>
        </div>
        
        <div>
          {(order.orderType === 'bank_transfer' || order.bankId) && (
            <BankTransferDetails order={order} />
          )}
          
          {order.orderType === 'momo' && order.receiptImage && (
            <div className="bg-[#232323] rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Hóa đơn thanh toán MoMo</h3>
              <div className="bg-[#1a1a1a] p-2 rounded">
                <img 
                  src={order.receiptImage.startsWith('http') 
                    ? order.receiptImage 
                    : `${window.location.origin}${order.receiptImage}`
                  } 
                  alt="Receipt" 
                  className="max-h-64 mx-auto"
                />
              </div>
              {order.receiptUploadDate && (
                <div className="text-sm text-gray-400 mt-2">
                  Tải lên lúc: {new Date(order.receiptUploadDate).toLocaleString()}
                </div>
              )}
            </div>
          )}
          
          {order.vnp_TransactionNo && (
            <div className="bg-[#232323] rounded-lg shadow p-6 mt-6">
              <h3 className="text-xl font-semibold mb-4">Thông tin giao dịch VNPAY</h3>
              
              <div className="mb-2">
                <span className="text-gray-400">Mã giao dịch VNPAY:</span> {order.vnp_TransactionNo}
              </div>
              
              {order.vnp_PayDate && (
                <div className="mb-2">
                  <span className="text-gray-400">Thời gian thanh toán:</span> {order.vnp_PayDate}
                </div>
              )}
              
              <div className="mb-2">
                <span className="text-gray-400">Mã phản hồi:</span> {order.vnp_ResponseCode || 'N/A'}
              </div>
              
              <div>
                <span className="text-gray-400">Nội dung:</span> {order.vnp_OrderInfo || 'N/A'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 