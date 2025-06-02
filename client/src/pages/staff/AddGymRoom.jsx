import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

const AddGymRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    roomType: 'cardio',
    status: 'active'
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }

      await axios.post('http://localhost:8001/api/gymrooms', form, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      alert('Thêm phòng tập thành công!');
      navigate('/staff/gymrooms');
    } catch (err) {
      console.error('Error adding room:', err);
      setError(err.response?.data?.message || 'Không thể thêm phòng tập. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thêm phòng tập mới</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên phòng</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
            required
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
            <option value="active">Hoạt động</option>
            <option value="maintenance">Bảo trì</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Loại phòng</label>
          <select
            name="roomType"
            value={form.roomType}
            onChange={handleChange}
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
          >
            <option value="cardio">Cardio</option>
            <option value="strength">Tập sức mạnh</option>
            <option value="yoga">Yoga</option>
            <option value="functional">Tập chức năng</option>
            <option value="group">Tập nhóm</option>
          </select>
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 } }}
          >
            {loading ? <CircularProgress size={24} /> : 'Thêm phòng tập'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/staff/gymrooms')}
            sx={{ color: 'var(--admin-primary)', borderColor: 'var(--admin-primary)', '&:hover': { borderColor: 'var(--admin-primary)', backgroundColor: 'rgba(26, 35, 126, 0.04)' } }}
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddGymRoom; 