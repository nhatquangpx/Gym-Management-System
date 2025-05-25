import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import StatusBadge from "../../components/features/admin/StatusBadge/StatusBadge";

export default function ViewTrainer() {
  const { id } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        // Tạm thời sử dụng dữ liệu mẫu để test
        const mockTrainer = {
          id: id,
          name: "Nguyễn Văn A",
          phone: "0901111222",
          email: "trainer.a@example.com",
          specialization: "Fitness & Yoga",
          experience: "5",
          status: "Đang làm việc",
          description: "Huấn luyện viên chuyên nghiệp với 5 năm kinh nghiệm trong lĩnh vực fitness và yoga. Đã đào tạo nhiều học viên đạt được mục tiêu tập luyện của họ."
        };
        setTrainer(mockTrainer);
        
        // Khi có API thật, uncomment đoạn code sau
        // const response = await fetch(`/api/trainers/${id}`);
        // const data = await response.json();
        // setTrainer(data);
      } catch (error) {
        console.error('Error fetching trainer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, [id]);

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!trainer) {
    return <div className="p-6">Không tìm thấy huấn luyện viên</div>;
  }

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Chi tiết huấn luyện viên</h1>
        <div className="flex gap-3">
          <Link
            to={`/admin/trainers/edit/${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FaEdit /> Chỉnh sửa
          </Link>
          <Link
            to="/admin/trainers"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <FaArrowLeft /> Quay lại
          </Link>
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
                <p className="text-lg">{trainer.specialization}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Kinh nghiệm</label>
                <p className="text-lg">{trainer.experience} năm</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Trạng thái</label>
                <div className="mt-1">
                  <StatusBadge status={trainer.status} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{trainer.description}</p>
        </div>
      </div>
    </div>
  );
} 