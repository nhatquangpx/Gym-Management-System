import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from "../../components/features/admin/Button/Button";
import { CircularProgress } from '@mui/material';
import axios from '../../utils/axiosConfig';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/employees/${id}`);
        const employee = response.data.data;
        
        setForm({
          name: employee.name,
          email: employee.email,
          phone: employee.phone || '',
          position: employee.employeeInfo?.position || '',
          salary: employee.employeeInfo?.salary || '',
          shiftSchedule: employee.employeeInfo?.shiftSchedule || '',
          performanceRating: employee.employeeInfo?.performanceRating || '',
          isActive: employee.isActive
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setError("Không thể tải thông tin nhân viên. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      
      const employeeData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        salary: form.salary ? Number(form.salary) : undefined,
        shiftSchedule: form.shiftSchedule,
        performanceRating: form.performanceRating ? Number(form.performanceRating) : undefined,
        isActive: form.isActive
      };
      
      await axios.put(`/api/employees/${id}`, employeeData);
      
      setSaving(false);
      alert('Đã cập nhật thông tin nhân viên!');
      navigate('/admin/employees');
    } catch (error) {
      console.error("Error updating employee:", error);
      setSaving(false);
      alert(`Lỗi: ${error.response?.data?.message || 'Không thể cập nhật nhân viên'}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6 flex justify-center items-center">
        <CircularProgress color="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6 flex justify-center items-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa nhân viên</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên</label>
          <input name="name" value={form.name || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Email</label>
          <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Số điện thoại</label>
          <input name="phone" value={form.phone || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Chức vụ</label>
          <input name="position" value={form.position || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Lương</label>
          <input name="salary" type="number" value={form.salary || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Lịch làm việc</label>
          <input name="shiftSchedule" value={form.shiftSchedule || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Đánh giá hiệu suất</label>
          <input name="performanceRating" type="number" min="1" max="5" step="0.1" value={form.performanceRating || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
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