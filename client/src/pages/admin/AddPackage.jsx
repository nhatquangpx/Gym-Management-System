import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/features/admin/Button/Button";

export default function AddPackage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    period: '/tháng',
    type: 'Tự tập',
    features: [],
    duration: 30
  });
  
  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'price' || name === 'duration' ? Number(value) : value });
  };
  
  const handleFeaturesChange = e => {
    const features = e.target.value.split('\n').filter(feature => feature.trim() !== '');
    setForm({ ...form, features });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch('http://localhost:8001/api/packages', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create package');
      }
      
      alert('Thêm gói tập thành công!');
      navigate('/admin/packages');
    } catch (error) {
      console.error('Error creating package:', error);
      alert('Có lỗi xảy ra: ' + error.message);
      
      // Nếu lỗi là do xác thực, chuyển hướng đến trang đăng nhập
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thêm gói tập mới</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên gói</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Mô tả</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" rows="3" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Giá</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Thời hạn</label>
          <select name="period" value={form.period} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]">
            <option value="/tháng">/tháng</option>
            <option value="/năm">/năm</option>
            <option value="/ngày">/ngày</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Loại gói</label>
          <select name="type" value={form.type} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]">
            <option value="Tự tập">Tự tập</option>
            <option value="Tập với PT">Tập với PT</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Thời hạn (ngày)</label>
          <input name="duration" type="number" value={form.duration} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tính năng (mỗi dòng là một tính năng)</label>
          <textarea 
            value={form.features.join('\n')} 
            onChange={handleFeaturesChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            rows="4"
            placeholder="Ví dụ:&#10;Sử dụng phòng tập&#10;Sử dụng phòng xông hơi&#10;Huấn luyện viên cá nhân"
          />
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
          <Link to="/admin/packages"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 