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
    password: '',
    specialization: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/trainers', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/admin/trainers');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi thêm huấn luyện viên');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi thêm huấn luyện viên');
      console.error('Error adding trainer:', error);
    } finally {
      setLoading(false);
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
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
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
          <label className="block mb-1 text-[var(--admin-text)]">Mật khẩu</label>
          <input 
            name="password" 
            type="password"
            value={form.password} 
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
        <div className="flex gap-3">
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Lưu'}
          </Button>
          <Link to="/admin/trainers"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 