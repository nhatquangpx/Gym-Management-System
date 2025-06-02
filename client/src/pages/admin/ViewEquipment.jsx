import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import { Button } from '@mui/material';

export default function ViewEquipment() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          navigate('/auth/login');
          return;
        }
        
        const response = await fetch(`http://localhost:8001/api/equipments/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch equipment');
        }
        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
        
        if (error.message.includes('token') || error.message.includes('unauthorized') || error.message.includes('forbidden')) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/auth/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id, navigate]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!equipment) return <div className="p-6">Không tìm thấy thiết bị</div>;

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Chi tiết thiết bị</h1>
        <div className="flex gap-3">
          <Button
            variant="contained"
            startIcon={<FaEdit />}
            onClick={() => navigate(`/admin/equipment/edit/${id}`)}
            sx={{
              backgroundColor: 'var(--admin-primary)',
              color: 'white',
              borderRadius: 1,
              fontWeight: 500,
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'var(--admin-primary-dark)',
                color: 'white',
                boxShadow: 'none',
                border: 'none'
              }
            }}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="outlined"
            startIcon={<FaArrowLeft />}
            onClick={() => navigate('/admin/equipment')}
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
      </div>
      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Thông tin thiết bị</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Tên thiết bị</label>
                <p className="text-lg">{equipment.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Phòng tập</label>
                <p className="text-lg">{equipment.roomId && equipment.roomId.name ? equipment.roomId.name : 'Không xác định'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Trạng thái</label>
                <p className="text-lg">{
                  equipment.status === 'active' ? 'Hoạt động' :
                  equipment.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'
                }</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Ngày mua</label>
                <p className="text-lg">{equipment.purchaseDate ? new Date(equipment.purchaseDate).toLocaleDateString() : 'Không có thông tin'}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Ngày hết hạn bảo hành</label>
                <p className="text-lg">{equipment.warrantyDate ? new Date(equipment.warrantyDate).toLocaleDateString() : 'Không có thông tin'}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{equipment.description || 'Không có mô tả'}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 