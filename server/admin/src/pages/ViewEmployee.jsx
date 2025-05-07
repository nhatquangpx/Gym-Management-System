import { useParams, Link } from 'react-router-dom';
import Button from '../components/Button/Button';

const employees = [
  { id: 1, name: 'Nguyễn Văn D', role: 'Huấn luyện viên', phone: '0901111222', status: 'Đang làm việc', avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 2, name: 'Phạm Thị E', role: 'Nhân viên lễ tân', phone: '0911222333', status: 'Nghỉ việc', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 3, name: 'Trần Văn F', role: 'Huấn luyện viên', phone: '0922333444', status: 'Đang làm việc', avatar: 'https://i.pravatar.cc/150?img=6' },
];

export default function ViewEmployee() {
  const { id } = useParams();
  const emp = employees.find(e => e.id === Number(id));
  if (!emp) return <div className="text-white p-6">Không tìm thấy nhân viên.</div>;
  return (
    <div className="bg-[#181818] min-h-screen p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Thông tin nhân viên</h1>
      <div className="bg-[#232323] rounded-lg shadow p-6 max-w-lg mx-auto">
        <div className="mb-4"><b>Tên:</b> {emp.name}</div>
        <div className="mb-4"><b>Chức vụ:</b> {emp.role}</div>
        <div className="mb-4"><b>Số điện thoại:</b> {emp.phone}</div>
        <div className="mb-4"><b>Trạng thái:</b> {emp.status}</div>
        <Link to="/employees"><Button>Quay lại</Button></Link>
      </div>
    </div>
  );
} 