import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button/Button';

const packages = [
  { id: 1, name: 'Gói 1 tháng', price: '500.000đ', status: 'Đang mở bán' },
  { id: 2, name: 'Gói 3 tháng', price: '1.200.000đ', status: 'Đang mở bán' },
  { id: 3, name: 'Gói 6 tháng', price: '2.000.000đ', status: 'Tạm dừng' },
];

export default function EditPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = packages.find(p => p.id === Number(id));
  const [form, setForm] = useState(pkg || {});
  if (!pkg) return <div className="text-white p-6">Không tìm thấy gói tập.</div>;
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên server
    alert('Đã lưu thay đổi!');
    navigate('/admin/packages');
  };
  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa gói tập</h1>
      <form className="bg-[#232323] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Tên gói</label>
          <input name="name" value={form.name || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Giá</label>
          <input name="price" value={form.price || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Trạng thái</label>
          <select name="status" value={form.status || ''} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]">
            <option value="Đang mở bán">Đang mở bán</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button type="submit">Lưu</Button>
          <Link to="/admin/packages"><Button type="button">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 