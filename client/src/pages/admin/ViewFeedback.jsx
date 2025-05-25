import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import StatusBadge from '../../components/features/admin/StatusBadge/StatusBadge';

export default function ViewFeedback() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        // Dữ liệu mẫu để test giao diện
        const mockFeedback = {
          id: id,
          member: {
            name: 'Nguyễn Văn A',
            phone: '0901111222',
            email: 'member.a@example.com',
          },
          trainer: {
            name: 'HLV Trần B',
            specialization: 'Fitness',
          },
          content: 'Phòng tập sạch sẽ, huấn luyện viên nhiệt tình, thiết bị hiện đại.',
          date: '2024-06-01',
          status: 'Đã xử lý',
          reply: 'Cảm ơn bạn đã phản hồi, chúng tôi sẽ tiếp tục phát huy!',
        };
        setFeedback(mockFeedback);
        // Khi có API thật, dùng đoạn sau:
        // const response = await fetch(`/api/feedback/${id}`);
        // const data = await response.json();
        // setFeedback(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, [id]);

  if (loading) return <div className="p-6">Đang tải...</div>;
  if (!feedback) return <div className="p-6">Không tìm thấy phản hồi</div>;

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Chi tiết phản hồi</h1>
        <div className="flex gap-3">
          <Link
            to={`/admin/feedback`}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 flex items-center gap-2"
          >
            <FaArrowLeft /> Quay lại
          </Link>
        </div>
      </div>
      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Hội viên</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm text-gray-500">Tên</label>
                <p className="text-lg">{feedback.member.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Số điện thoại</label>
                <p className="text-lg">{feedback.member.phone}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Email</label>
                <p className="text-lg">{feedback.member.email}</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Huấn luyện viên</h3>
            <div className="space-y-2">
              <div>
                <label className="block text-sm text-gray-500">Tên</label>
                <p className="text-lg">{feedback.trainer.name}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500">Chuyên môn</label>
                <p className="text-lg">{feedback.trainer.specialization}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Nội dung phản hồi</h3>
          <p className="text-gray-700 whitespace-pre-wrap mb-2">{feedback.content}</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-1">Ngày gửi</h4>
            <p className="text-gray-700 whitespace-pre-wrap">{new Date(feedback.date).toLocaleDateString()}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-1">Trạng thái</h4>
            <StatusBadge status={feedback.status} />
          </div>
        </div>
        {feedback.reply && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Phản hồi từ quản trị viên</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{feedback.reply}</p>
          </div>
        )}
      </div>
    </div>
  );
} 