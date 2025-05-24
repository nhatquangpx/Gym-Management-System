import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft, FaEdit } from 'react-icons/fa';
import StatusBadge from "../../components/features/admin/StatusBadge/StatusBadge";

export default function ViewWorkout() {
  const { id } = useParams();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch(`/api/workouts/${id}`);
        const data = await response.json();
        setWorkout(data);
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  if (!workout) {
    return <div className="p-6">Không tìm thấy lịch sử tập luyện</div>;
  }

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Chi tiết lịch sử tập luyện</h1>
        <div className="flex gap-3">
          <Link
            to={`/admin/workouts/edit/${id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FaEdit /> Chỉnh sửa
          </Link>
          <Link
            to="/admin/workouts"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <FaArrowLeft /> Quay lại
          </Link>
        </div>
      </div>

      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Thông tin buổi tập</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Ngày tập</label>
                <p className="text-lg">{new Date(workout.date).toLocaleDateString('vi-VN')}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Thời gian bắt đầu</label>
                <p className="text-lg">{workout.startTime}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Thời gian kết thúc</label>
                <p className="text-lg">{workout.endTime}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Trạng thái</label>
                <div className="mt-1">
                  <StatusBadge status={workout.status} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Thông tin thành viên</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Tên thành viên</label>
                <p className="text-lg">{workout.memberName}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Số điện thoại</label>
                <p className="text-lg">{workout.memberPhone}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Email</label>
                <p className="text-lg">{workout.memberEmail}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Thông tin huấn luyện viên</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-gray-500">Tên huấn luyện viên</label>
              <p className="text-lg">{workout.trainerName}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Chuyên môn</label>
              <p className="text-lg">{workout.trainerSpecialization}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Nội dung buổi tập</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500">Bài tập</label>
              <p className="text-lg">{workout.exercises}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Ghi chú</label>
              <p className="text-gray-700 whitespace-pre-wrap">{workout.notes}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Đánh giá</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-500">Đánh giá từ huấn luyện viên</label>
              <p className="text-gray-700 whitespace-pre-wrap">{workout.trainerFeedback}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-500">Đánh giá từ thành viên</label>
              <p className="text-gray-700 whitespace-pre-wrap">{workout.memberFeedback}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 