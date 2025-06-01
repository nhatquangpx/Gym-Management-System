import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {TextareaAutosize} from '@mui/material';
import axios from 'axios';
import ButtonComponent from "../../components/features/admin/Button/Button";

const AddPackage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    period: '/tháng',
    type: 'Tự tập',
    typePackage: 'gym',
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
    setError(null);

    try {
      await axios.post('/api/packages', form);
      alert('Thêm gói tập thành công!');
      navigate('/admin/packages');
    } catch (err) {
      console.error('Error adding package:', err);
      setError(err.response?.data?.message || 'Không thể thêm gói tập. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thêm gói tập mới</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên gói</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Mô tả</label>
          <textarea 
            name="description" 
            value={form.description} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            rows="3" 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Giá</label>
          <input 
            name="price" 
            type="number" 
            value={form.price} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Thời hạn</label>
          <select 
            name="period" 
            value={form.period} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
          >
            <option value="/tháng">/tháng</option>
            <option value="/năm">/năm</option>
            <option value="/ngày">/ngày</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Loại gói</label>
          <select 
            name="type" 
            value={form.type} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
          >
            <option value="Tự tập">Tự tập</option>
            <option value="Tập với PT">Tập với PT</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Loại hình tập</label>
          <select 
            name="typePackage" 
            value={form.typePackage} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
          >
            <option value="gym">Gym</option>
            <option value="yoga">Yoga</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Thời hạn (ngày)</label>
          <input 
            name="duration" 
            type="number" 
            value={form.duration} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tính năng (mỗi dòng là một tính năng)</label>
          <TextareaAutosize
            name="features"
            value={form.features.join('\n')}
            onChange={handleFeaturesChange}
            minRows={4}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              backgroundColor: 'var(--admin-header)',
              color: 'var(--admin-text)',
              border: '1px solid var(--admin-border)',
              fontFamily: 'inherit',
              fontSize: '1rem',
              resize: 'vertical'
            }}
            placeholder="Ví dụ:&#10;Sử dụng phòng tập&#10;Sử dụng phòng xông hơi&#10;Huấn luyện viên cá nhân"
          />
        </div>

        <div className="flex gap-3">
          <ButtonComponent type="submit" color="primary" disabled={loading}>
            {loading ? 'Đang thêm...' : 'Thêm gói tập'}
          </ButtonComponent>
          <Link to="/admin/packages"><ButtonComponent type="button" color="secondary">Hủy</ButtonComponent></Link>
        </div>
      </form>
    </div>
  );
};

export default AddPackage; 