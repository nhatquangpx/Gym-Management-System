import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import StatusBadge from "../../components/features/admin/StatusBadge/StatusBadge";
import Button from '@mui/material/Button';

export default function ViewTrainer() {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          setTrainer(data.data);
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

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
        <Link
          to="/admin/trainers"
          className="mt-4 inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2 w-fit"
        >
          <FaArrowLeft /> Quay lại
        </Link>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="p-6">
        <div className="text-center">Không tìm thấy huấn luyện viên</div>
        <Link
          to="/admin/trainers"
          className="mt-4 inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2 w-fit"
        >
          <FaArrowLeft /> Quay lại
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Chi tiết huấn luyện viên</h1>
        <div className="flex gap-3">
          <Button
            variant="contained"
            startIcon={<FaEdit />}
            component={Link}
            to={`/admin/trainers/edit/${id}`}
            sx={{
              backgroundColor: 'var(--admin-primary)',
              color: 'white',
              borderRadius: 1,
              fontWeight: 500,
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { backgroundColor: 'var(--admin-primary-dark)', boxShadow: 'none' }
            }}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="contained"
            startIcon={<FaArrowLeft />}
            component={Link}
            to="/admin/trainers"
            sx={{
              backgroundColor: 'var(--admin-gray, #6b7280)',
              color: 'white',
              borderRadius: 1,
              fontWeight: 500,
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { backgroundColor: '#4b5563', boxShadow: 'none' }
            }}
          >
            Quay lại
          </Button>
        </div>
      </div>

      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Tên</label>
                <p className="text-lg">{trainer.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Số điện thoại</label>
                <p className="text-lg">{trainer.phone}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Email</label>
                <p className="text-lg">{trainer.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Thông tin chuyên môn</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Chuyên môn</label>
                <p className="text-lg">{trainer.trainerInfo?.specialization || 'Chưa cập nhật'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Loại hình tập</label>
                <p className="text-lg">{trainer.trainerInfo?.type === 'gym' ? 'Gym' : 'Yoga'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 