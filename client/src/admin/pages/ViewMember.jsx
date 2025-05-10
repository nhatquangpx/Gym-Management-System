import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button/Button';

const members = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', status: 'Đang hoạt động', joinDate: '01/01/2023' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0912345678', status: 'Đang hoạt động', joinDate: '15/02/2023' },
  { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0923456789', status: 'Tạm dừng', joinDate: '01/03/2023' },
];

export default function ViewMember() {
  const { id } = useParams();
  const member = members.find(m => m.id === Number(id));
  if (!member) return <div className="text-white p-6">Không tìm thấy thành viên.</div>;
  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Thông tin thành viên</h1>
      <div className="bg-[#232323] rounded-lg shadow p-6 max-w-lg mx-auto">
        <div className="mb-4"><b>Tên:</b> {member.name}</div>
        <div className="mb-4"><b>Email:</b> {member.email}</div>
        <div className="mb-4"><b>Số điện thoại:</b> {member.phone}</div>
        <div className="mb-4"><b>Trạng thái:</b> {member.status}</div>
        <div className="mb-4"><b>Ngày tham gia:</b> {member.joinDate}</div>
        <Link to="/admin/members"><Button>Quay lại</Button></Link>
      </div>
    </div>
  );
} 