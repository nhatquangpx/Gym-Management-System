import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from "../../components/features/admin/Button/Button";
import axios from '../../utils/axiosConfig';

export default function ViewMember() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  useEffect(() => {
    const fetchMember = async () => {
      try {
        // Không cần thêm token vào headers vì đã xử lý trong axiosConfig
        const response = await axios.get(`/api/members/${id}`);
        setMember(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching member:", err);
        setError("Không thể tải thông tin thành viên. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) return <div className="text-[var(--admin-text)] p-6">Đang tải...</div>;
  if (error) return <div className="text-[var(--admin-text)] p-6">{error}</div>;
  if (!member) return <div className="text-[var(--admin-text)] p-6">Không tìm thấy thành viên.</div>;  // Định dạng ngày tham gia
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Xác định trạng thái thành viên dựa trên dữ liệu từ API
  const getMemberStatus = () => {
    if (member.isActive === false) return 'Tạm dừng';
    return 'Đang hoạt động';
  };

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6 text-[var(--admin-text)]">
      <h1 className="text-2xl font-bold mb-6">Thông tin hội viên</h1>
      <div className="bg-[var(--admin-sidebar)] rounded-lg shadow p-6 max-w-lg mx-auto">
        <div className="mb-4"><b>Tên:</b> {member.name || `${member.firstName || ''} ${member.lastName || ''}`}</div>
        <div className="mb-4"><b>Email:</b> {member.email}</div>
        <div className="mb-4"><b>Số điện thoại:</b> {member.phone}</div>
        <div className="mb-4"><b>Trạng thái:</b> {getMemberStatus()}</div>
        <div className="mb-4"><b>Ngày tham gia:</b> {formatDate(member.createdAt)}</div>
        {member.address && <div className="mb-4"><b>Địa chỉ:</b> {member.address}</div>}
        <Link to="/admin/members"><Button color="secondary">Quay lại</Button></Link>
      </div>
    </div>
  );
}