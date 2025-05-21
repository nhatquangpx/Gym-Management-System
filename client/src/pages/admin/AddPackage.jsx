import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/features/admin/Button/Button";

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
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thêm gói tập mới</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên gói</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Giá</label>
          <input name="price" value={form.price} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]">
            <option value="Đang mở bán">Đang mở bán</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary">Lưu</Button>
          <Link to="/admin/packages"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 