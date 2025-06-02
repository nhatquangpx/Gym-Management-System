import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
} from '@mui/material';
import axios from 'axios';
import ButtonComponent from "../../components/features/admin/Button/Button";

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const response = await axios.get(`/api/members/${id}`);
        const member = response.data.data;
        
        setForm({
          name: member.name || `${member.firstName || ''} ${member.lastName || ''}`,
          email: member.email,
          phone: member.phone || '',
          address: member.memberInfo?.address || '',
          gender: member.memberInfo?.gender || '',
          job: member.memberInfo?.job || '',
          status: member.isActive !== false ? 'Đang hoạt động' : 'Tạm dừng',
          isActive: member.isActive !== false
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching member:", err);
        setError("Không thể tải thông tin thành viên. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) return <div className="text-[var(--admin-text)] p-6">Đang tải...</div>;
  if (error) return <div className="text-[var(--admin-text)] p-6">{error}</div>;

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
      
      setLoading(true);
      
      await axios.put(`/api/members/${id}`, memberData);
      
      setLoading(false);
      alert('Đã cập nhật thành công!');
      navigate('/staff/members');
    } catch (err) {
      setLoading(false);
      console.error("Error updating member:", err);
      alert(`Không thể cập nhật thành viên: ${err.response?.data?.message || 'Đã xảy ra lỗi'}`);
    }
  };

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Chỉnh sửa hội viên</h1>
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên</label>
          <input 
            name="name" 
            value={form.name || ''} 
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
            value={form.email || ''} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Số điện thoại</label>
          <input 
            name="phone" 
            value={form.phone || ''} 
            onChange={handleChange}
            placeholder="Nhập số điện thoại"
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Địa chỉ</label>
          <input 
            name="address" 
            value={form.address || ''} 
            onChange={handleChange}
            placeholder="Nhập địa chỉ"
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Giới tính</label>
          <select 
            name="gender" 
            value={form.gender || ''} 
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
            value={form.job || ''} 
            onChange={handleChange}
            placeholder="Nhập nghề nghiệp"
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Trạng thái</label>
          <select 
            name="status" 
            value={form.status || 'Đang hoạt động'} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
          >
            <option value="Đang hoạt động">Đang hoạt động</option>
            <option value="Tạm dừng">Tạm dừng</option>
          </select>
        </div>
        <div className="flex gap-3">
          <ButtonComponent type="submit" color="primary" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Lưu'}
          </ButtonComponent>
          <Link to="/staff/members"><ButtonComponent type="button" color="secondary">Hủy</ButtonComponent></Link>
        </div>
      </form>
    </div>
  );
};

export default EditMember; 