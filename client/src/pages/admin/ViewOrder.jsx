import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from "../../components/features/admin/Button/Button";

export default function ViewOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order');
        }
        const data = await response.json();
        setOrder(data.data || data);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);

  const getStatusText = (status) => {
    switch(status) {
      case 'completed': return 'Đã thanh toán';
      case 'pending': return 'Chờ thanh toán';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  if (loading) return <div className="text-[var(--admin-text)] p-6">Đang tải...</div>;
  if (!order) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy đơn hàng.</div>;
  
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thông tin đơn hàng</h1>
      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto">
        <div className="mb-4"><b>Khách hàng:</b> {order.userId?.name || 'N/A'}</div>
        <div className="mb-4"><b>Gói tập:</b> {order.packageId?.name || 'N/A'}</div>
        <div className="mb-4"><b>Tổng tiền:</b> {order.totalAmount}</div>
        <div className="mb-4"><b>Trạng thái:</b> {getStatusText(order.status)}</div>
        <div className="mb-4"><b>Ngày tạo:</b> {new Date(order.createdAt).toLocaleDateString()}</div>
        
        <div className="flex gap-3">
          <Link to={`/admin/orders/edit/${id}`}><Button color="primary">Chỉnh sửa</Button></Link>
          <Link to="/admin/orders"><Button color="secondary">Quay lại</Button></Link>
        </div>
      </div>
    </div>
  );
} 