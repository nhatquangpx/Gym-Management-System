import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, TextField, Button, MenuItem, FormControl, InputLabel, Select,
  ThemeProvider, createTheme, Alert
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f8cff',
    },
  },
});

export default function AddEquipment() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'active',
    purchaseDate: '',
    warrantyDate: '',
    roomId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch('http://localhost:8001/api/gymrooms', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Không thể tải danh sách phòng tập');
      }
      
      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phòng tập:', error);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!form.roomId) {
      setError('Vui lòng chọn phòng tập cho thiết bị');
      setLoading(false);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        navigate('/auth/login');
        return;
      }
      
      const response = await fetch('http://localhost:8001/api/equipments', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể thêm thiết bị');
      }
      
      alert('Thêm thiết bị thành công!');
      navigate('/staff/equipment');
    } catch (error) {
      console.error('Lỗi khi thêm thiết bị:', error);
      setError(error.message);
      
      if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
        <h1 className="text-2xl font-bold mb-6">Thêm thiết bị mới</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
        )}
        <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-[var(--admin-text)]">Tên thiết bị</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-[var(--admin-text)]">Phòng tập</label>
            <select
              name="roomId"
              value={form.roomId}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
              required
            >
              <option value="">-- Chọn phòng tập --</option>
              {rooms.map(room => (
                <option key={room._id} value={room._id}>{room.name}</option>
              ))}
            </select>
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
            <label className="block mb-1 text-[var(--admin-text)]">Ngày mua</label>
            <input
              name="purchaseDate"
              type="date"
              value={form.purchaseDate}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-[var(--admin-text)]">Ngày hết hạn bảo hành</label>
            <input
              name="warrantyDate"
              type="date"
              value={form.warrantyDate}
              onChange={handleChange}
              className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
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
          <div className="flex gap-3 mt-6">
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ backgroundColor: 'var(--admin-primary)', '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 } }}
            >
              {loading ? 'Đang xử lý...' : 'Lưu'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/staff/equipment')}
              sx={{ color: 'var(--admin-primary)', borderColor: 'var(--admin-primary)', '&:hover': { borderColor: 'var(--admin-primary)', backgroundColor: 'rgba(26, 35, 126, 0.04)' } }}
            >
              Hủy
            </Button>
          </div>
        </form>
      </div>
    </ThemeProvider>
  );
} 