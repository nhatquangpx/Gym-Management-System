import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button/Button';

const employees = [
  { id: 1, name: 'Nguyễn Văn D', role: 'Huấn luyện viên', phone: '0901111222', status: 'Đang làm việc', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 2, name: 'Phạm Thị E', role: 'Nhân viên lễ tân', phone: '0911222333', status: 'Nghỉ việc', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, name: 'Trần Văn F', role: 'Huấn luyện viên', phone: '0922333444', status: 'Đang làm việc', avatar: 'https://i.pravatar.cc/150?img=6' },
];

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const emp = employees.find(e => e.id === Number(id));
  const [form, setForm] = useState(emp || {});
  if (!emp) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy nhân viên.</div>;
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên server
    alert('Đã lưu thay đổi!');
    navigate('/admin/employees');
  };
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa nhân viên</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên</label>
          <input name="name" value={form.name || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Chức vụ</label>
          <input name="role" value={form.role || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Số điện thoại</label>
          <input name="phone" value={form.phone || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Trạng thái</label>
          <select name="status" value={form.status || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]">
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary">Lưu</Button>
          <Link to="/admin/employees"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 