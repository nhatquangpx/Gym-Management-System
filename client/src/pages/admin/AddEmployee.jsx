import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/features/admin/Button/Button";
import { FaArrowLeft } from 'react-icons/fa';
import axios from '../../utils/axiosConfig';

export default function AddEmployee() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    position: '',
    salary: '',
    shiftSchedule: '',
    performanceRating: '',
    isActive: true
  });

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setSaving(true);

      const employeeData = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        position: form.position,
        salary: form.salary ? Number(form.salary) : undefined,
        shiftSchedule: form.shiftSchedule,
        performanceRating: form.performanceRating ? Number(form.performanceRating) : undefined,
        isActive: form.isActive
      };

      await axios.post('/api/employees', employeeData);
      
      setSaving(false);
      alert('Đã thêm nhân viên mới!');
      navigate('/admin/employees');
    } catch (error) {
      console.error("Error creating employee:", error);
      setSaving(false);
      alert(`Lỗi: ${error.response?.data?.message || 'Không thể thêm nhân viên'}`);
    }
  };
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Thêm nhân viên</h1>
        <Link
          to="/admin/employees"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
        >
          <FaArrowLeft /> Quay lại
        </Link>
      </div>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên <span className="text-red-500">*</span></label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Email <span className="text-red-500">*</span></label>
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
          <label className="block mb-1 text-[var(--admin-text)]">Mật khẩu <span className="text-red-500">*</span></label>
          <input 
            name="password"
            type="password" 
            value={form.password} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
            minLength={6}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Số điện thoại</label>
          <input 
            name="phone" 
            value={form.phone} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Chức vụ</label>
          <input 
            name="position" 
            value={form.position} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Lương</label>
          <input 
            name="salary"
            type="number" 
            value={form.salary} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Lịch làm việc</label>
          <input 
            name="shiftSchedule" 
            value={form.shiftSchedule} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Đánh giá hiệu suất</label>
          <input 
            name="performanceRating"
            type="number" 
            min="1" 
            max="5" 
            step="0.1"
            value={form.performanceRating} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              name="isActive" 
              type="checkbox" 
              checked={form.isActive} 
              onChange={handleChange} 
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2 text-[var(--admin-text)]">
              Đang làm việc
            </span>
          </label>
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary" disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
          <Link to="/admin/employees"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
}