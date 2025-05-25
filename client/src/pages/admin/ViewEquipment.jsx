import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';

export default function ViewEquipment() {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        // Dữ liệu mẫu để test giao diện
        const mockEquipment = {
          id: id,
          name: 'Máy chạy bộ TechnoGym',
          type: 'Cardio',
          status: 'active',
          maintenanceDate: '2024-06-01',
          description: 'Máy chạy bộ cao cấp nhập khẩu từ Ý, hỗ trợ nhiều chế độ tập luyện và cảm biến nhịp tim.'
        };
        setEquipment(mockEquipment);
        // Khi có API thật, dùng đoạn sau:
        // const response = await fetch(`/api/equipment/${id}`);
        // const data = await response.json();
        // setEquipment(data);
      } catch (error) {
        console.error('Error fetching equipment:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!equipment) return <div className="p-6">Không tìm thấy thiết bị</div>;

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Chi tiết thiết bị</h1>
        <div className="flex gap-3">
          <Link
            to={`/admin/equipment/edit/${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FaEdit /> Chỉnh sửa
          </Link>
          <Link
            to="/admin/equipment"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <FaArrowLeft /> Quay lại
          </Link>
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
                <label className="block text-sm text-gray-500">Loại</label>
                <p className="text-lg">{equipment.type}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Trạng thái</label>
                <p className="text-lg">{
                  equipment.status === 'active' ? 'Hoạt động' :
                  equipment.status === 'maintenance' ? 'Bảo trì' : 'Không hoạt động'
                }</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Ngày bảo trì gần nhất</label>
                <p className="text-lg">{equipment.maintenanceDate ? new Date(equipment.maintenanceDate).toLocaleDateString() : ''}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{equipment.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 