import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button/Button';

export default function AddPackage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    status: 'Đang mở bán',
  });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await fetch('/api/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/admin/packages');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };
  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Thêm gói tập mới</h1>
      <form className="bg-[#232323] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Tên gói</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Giá</label>
          <input name="price" value={form.price} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]">
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