import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/features/admin/Button/Button";
import { FaArrowLeft } from 'react-icons/fa';

export default function AddTrainer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: '',
    experience: '',
    status: 'Đang làm việc',
    description: '',
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await fetch('/api/trainers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/admin/trainers');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Thêm huấn luyện viên</h1>
        <Link
          to="/admin/trainers"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
        >
          <FaArrowLeft /> Quay lại
        </Link>
      </div>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Số điện thoại</label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Email</label>
          <input 
            name="email" 
            type="email"
            value={form.email} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Chuyên môn</label>
          <input 
            name="specialization" 
            value={form.specialization} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Kinh nghiệm (năm)</label>
          <input 
            name="experience" 
            type="number"
            value={form.experience} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Trạng thái</label>
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
          >
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Mô tả</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            rows="4"
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary">Lưu</Button>
          <Link to="/admin/trainers"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 