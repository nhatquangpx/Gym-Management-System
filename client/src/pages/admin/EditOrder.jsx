import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/features/admin/Button/Button";

const orders = [
  { id: 1, customer: 'Nguyễn Văn A', package: 'Gói 1 tháng', total: '500.000đ', status: 'Đã thanh toán' },
  { id: 2, customer: 'Trần Thị B', package: 'Gói 3 tháng', total: '1.200.000đ', status: 'Chờ thanh toán' },
  { id: 3, customer: 'Lê Văn C', package: 'Gói 6 tháng', total: '2.000.000đ', status: 'Đã hủy' },
];

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = orders.find(o => o.id === Number(id));
  const [form, setForm] = useState(order || {});
  if (!order) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy đơn hàng.</div>;
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên server
    alert('Đã lưu thay đổi!');
    navigate('/admin/orders');
  };
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa đơn hàng</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Khách hàng</label>
          <input name="customer" value={form.customer || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Gói tập</label>
          <input name="package" value={form.package || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tổng tiền</label>
          <input name="total" value={form.total || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Trạng thái</label>
          <select name="status" value={form.status || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]">
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary">Lưu</Button>
          <Link to="/admin/orders"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 