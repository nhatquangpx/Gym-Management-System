import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/features/admin/Button/Button";
import axios from '../../utils/axiosConfig';

export default function AddMember() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    job: '',
    status: 'Đang hoạt động',
    isActive: true
  });

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "status") {
      setForm({ 
        ...form, 
        status: value,
        isActive: value === 'Đang hoạt động' 
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const memberData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        gender: form.gender,
        job: form.job,
        isActive: form.isActive
      };

      await axios.post('/api/members', memberData);
      alert('Thêm thành viên thành công!');
      navigate('/staff/members');
    } catch (err) {
      console.error("Error adding member:", err);
      setError(err.response?.data?.message || 'Không thể thêm thành viên. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thêm hội viên mới</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
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
          <label className="block mb-1 text-[var(--admin-text)]">Địa chỉ</label>
          <input 
            name="address" 
            value={form.address} 
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Giới tính</label>
          <select 
            name="gender" 
            value={form.gender} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Nghề nghiệp</label>
          <input 
            name="job" 
            value={form.job} 
            onChange={handleChange}
            placeholder="Nhập nghề nghiệp"
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
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
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
        </div>

        <div className="flex gap-3">
          <Button type="submit" color="primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Lưu'}
          </Button>
          <Link to="/staff/members"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 