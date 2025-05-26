import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from "../../components/features/admin/Button/Button";

export default function EditPackage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    price: '',
    status: ''
  });
  
  useEffect(() => {
    fetchPackage();
  }, [id]);
  
  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/packages/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch package');
      }
      const data = await response.json();
      setForm(data);
    } catch (error) {
      console.error('Error fetching package:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/admins/packages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update package');
      }
      
      alert('Đã lưu thay đổi!');
      navigate('/admin/packages');
    } catch (error) {
      console.error('Error updating package:', error);
      alert('Lỗi khi cập nhật gói tập: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-[var(--admin-text)] p-6">Đang tải...</div>;
  
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa gói tập</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên gói</label>
          <input name="name" value={form.name || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Giá</label>
          <input name="price" value={form.price || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Trạng thái</label>
          <select name="status" value={form.status || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]">
            <option value="Đang mở bán">Đang mở bán</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
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