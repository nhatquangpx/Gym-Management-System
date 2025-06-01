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
        const response = await fetch(`/api/schedules/${id}`);
        const data = await response.json();
        setWorkout(data.data);
      } catch (error) {
        console.error('Error fetching workout:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkout();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!workout) return <div className="p-6">Không tìm thấy buổi tập</div>;

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Chi tiết buổi tập</h1>
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
            <h3 className="text-lg font-semibold mb-2">Thông tin chung</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Ngày tập</label>
                <p className="text-lg">{new Date(workout.date).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Giờ bắt đầu</label>
                <p className="text-lg">{workout.startTime}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Giờ kết thúc</label>
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
            <h3 className="text-lg font-semibold mb-2">Hội viên & HLV</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500">Hội viên</label>
                <p className="text-lg">{workout.member.name} ({workout.member.phone})</p>
                <p className="text-sm text-gray-400">{workout.member.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Huấn luyện viên</label>
                <p className="text-lg">{workout.trainer.name}</p>
                <p className="text-sm text-gray-400">{workout.trainer.specialization}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Nội dung buổi tập</h3>
          <p className="text-gray-700 whitespace-pre-wrap mb-2"><b>Bài tập:</b> {workout.content.exercises}</p>
          <p className="text-gray-700 whitespace-pre-wrap"><b>Ghi chú:</b> {workout.content.notes}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Nhận xét của HLV</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{workout.feedback.trainer}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Nhận xét của hội viên</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{workout.feedback.member}</p>
          </div>
        </div>
      </div>
    </div>
  );
} 