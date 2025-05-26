import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from "../../components/features/admin/Button/Button";

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    userId: '',
    packageId: '',
    totalAmount: '',
    status: ''
  });
  
  useEffect(() => {
    fetchOrder();
  }, [id]);
  
  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data = await response.json();
      setForm({
        userId: data.userId ? data.userId.name : '',
        packageId: data.packageId ? data.packageId.name : '',
        totalAmount: data.totalAmount,
        status: data.status
      });
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // For orders, we only update the status
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: form.status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      
      alert('Đã lưu thay đổi!');
      navigate('/admin/orders');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Lỗi khi cập nhật đơn hàng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-[var(--admin-text)] p-6">Đang tải...</div>;
  
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa đơn hàng</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Khách hàng</label>
          <input name="userId" value={form.userId || ''} readOnly className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)] opacity-70" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Gói tập</label>
          <input name="packageId" value={form.packageId || ''} readOnly className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)] opacity-70" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tổng tiền</label>
          <input name="totalAmount" value={form.totalAmount || ''} readOnly className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)] opacity-70" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Trạng thái</label>
          <select name="status" value={form.status || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]">
            <option value="completed">Đã thanh toán</option>
            <option value="pending">Chờ thanh toán</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
          <Link to="/admin/orders"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 