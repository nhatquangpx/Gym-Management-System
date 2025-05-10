import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button/Button';

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
  if (!order) return <div className="text-white p-6">Không tìm thấy đơn hàng.</div>;
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên server
    alert('Đã lưu thay đổi!');
    navigate('/orders');
  };
  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa đơn hàng</h1>
      <form className="bg-[#232323] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Khách hàng</label>
          <input name="customer" value={form.customer || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Gói tập</label>
          <input name="package" value={form.package || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Tổng tiền</label>
          <input name="total" value={form.total || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Trạng thái</label>
          <select name="status" value={form.status || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]">
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button type="submit">Lưu</Button>
          <Link to="/admin/orders"><Button type="button">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 