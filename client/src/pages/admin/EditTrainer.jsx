import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { FaArrowLeft } from 'react-icons/fa';

export default function EditTrainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    specialization: '',
    type: 'gym'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const response = await fetch(`/api/trainers/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setForm({
            name: data.data.name,
            phone: data.data.phone,
            email: data.data.email,
            specialization: data.data.trainerInfo?.specialization || '',
            type: data.data.trainerInfo?.type || 'gym'
          });
        } else {
          setError(data.message || 'Không thể tải thông tin huấn luyện viên');
        }
      } catch (error) {
        console.error('Error fetching trainer:', error);
        setError('Có lỗi xảy ra khi tải thông tin huấn luyện viên');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/trainers/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      
      if (data.success) {
        navigate('/admin/trainers');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi cập nhật huấn luyện viên');
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi cập nhật huấn luyện viên');
      console.error('Error updating trainer:', error);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Chỉnh sửa huấn luyện viên</h1>
        <Button
          variant="outlined"
          startIcon={<FaArrowLeft />}
          onClick={() => navigate('/admin/trainers')}
          sx={{
            color: 'var(--admin-primary)',
            borderColor: 'var(--admin-primary)',
            backgroundColor: 'white',
            borderRadius: 2,
            fontWeight: 500,
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: 'rgba(79, 140, 255, 0.08)',
              borderColor: 'var(--admin-primary)',
              color: 'var(--admin-primary)'
            }
          }}
        >
          Quay lại
        </Button>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <form className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Tên</label>
          <input 
            name="name" 
            value={form.name} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Số điện thoại</label>
          <input 
            name="phone" 
            value={form.phone} 
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
            value={form.email} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Chuyên môn</label>
          <input 
            name="specialization" 
            value={form.specialization} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]" 
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-[var(--admin-text)]">Loại hình tập</label>
          <select 
            name="type" 
            value={form.type} 
            onChange={handleChange} 
            className="w-full p-2 rounded bg-[var(--admin-header)] text-[var(--admin-text)] border border-[var(--admin-border)]"
          >
            <option value="gym">Gym</option>
            <option value="yoga">Yoga</option>
          </select>
        </div>
        <div className="flex gap-3">
          <Button type="submit" color="primary" disabled={updateLoading}>
            {updateLoading ? 'Đang xử lý...' : 'Lưu thay đổi'}
          </Button>
          <Link to="/admin/trainers"><Button type="button" color="secondary">Hủy</Button></Link>
        </div>
      </form>
    </div>
  );
} 