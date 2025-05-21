import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import Button from "../../components/features/admin/Button/Button";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    role: '',
    phone: '',
    status: 'Đang làm việc',
  });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      navigate('/admin/employees');
    } catch (error) {
      alert('Có lỗi xảy ra!');
    }
  };
  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Thêm nhân viên/Huấn luyện viên mới</h1>
      <form className="bg-[#232323] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Tên</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Chức vụ</label>
          <input name="role" value={form.role} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Số điện thoại</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]" />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Trạng thái</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 rounded bg-[#181818] text-white border border-[#444]">
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Nghỉ việc">Nghỉ việc</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button type="submit">Lưu</Button>
          <Link to="/admin/employees"><Button type="button">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 