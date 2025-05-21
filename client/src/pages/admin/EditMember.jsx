import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/features/admin/Button/Button";

const members = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', status: 'Đang hoạt động', joinDate: '01/01/2023' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0912345678', status: 'Đang hoạt động', joinDate: '15/02/2023' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0923456789', status: 'Tạm dừng', joinDate: '01/03/2023' },
];

export default function EditMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const member = members.find(m => m.id === Number(id));
  const [form, setForm] = useState(member || {});
  if (!member) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy thành viên.</div>;
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Gửi dữ liệu lên server
    alert('Đã lưu thay đổi!');
    navigate('/admin/members');
  };
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa thành viên</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên</label>
          <input name="name" value={form.name || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Email</label>
          <input name="email" value={form.email || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Số điện thoại</label>
          <input name="phone" value={form.phone || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Trạng thái</label>
          <select name="status" value={form.status || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]">
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Ngày tham gia</label>
          <input name="joinDate" value={form.joinDate || ''} onChange={handleChange} className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" />
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary">Lưu</Button>
          <Link to="/admin/members"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 