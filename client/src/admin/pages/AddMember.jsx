import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '../components/Button/Button';

export default function AddMember() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Đang hoạt động',
    joinDate: ''
  });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/admin/members');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };
  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Thêm thành viên mới</h1>
      <form className="bg-[#232323] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Tên</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Số điện thoại</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]">
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Ngày tham gia</label>
          <input name="joinDate" value={form.joinDate} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="flex gap-3">
          <Button type="submit">Lưu</Button>
          <Link to="/admin/members"><Button type="button">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 