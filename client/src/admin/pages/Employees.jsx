import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import StatusBadge from '../components/StatusBadge/StatusBadge';
import AddButton from '../../components/AddButton';

export default function Employees() {
  const employees = [
    { id: 1, name: "Nguyễn Văn D", role: "Huấn luyện viên", phone: "0901111222", status: "Đang làm việc", avatar: "https://i.pravatar.cc/150?img=4" },
    { id: 2, name: "Phạm Thị E", role: "Nhân viên lễ tân", phone: "0911222333", status: "Nghỉ việc", avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 3, name: "Trần Văn F", role: "Huấn luyện viên", phone: "0922333444", status: "Đang làm việc", avatar: "https://i.pravatar.cc/150?img=6" },
  ];
  return (
    <div className="bg-[#181818] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Danh sách nhân viên/Huấn luyện viên</h1>
        <Link to="/admin/employees/add">
          <AddButton label="Thêm nhân viên/Huấn luyện viên" />
        </Link>
      </div>
      <Paper sx={{ background: '#232323', color: '#fff', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[#1f1f1f] text-[#e53935]">
                <th className="py-3 px-4 text-left">Nhân sự</th>
                <th className="py-3 px-4 text-left">Chức vụ</th>
                <th className="py-3 px-4 text-left">Số điện thoại</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id} className="border-b border-[#333] hover:bg-[#252525] transition rounded-xl">
                  <td className="py-2 px-4 flex items-center gap-3 text-white">
                    <Avatar src={e.avatar} alt={e.name} />
                    <span>{e.name}</span>
                  </td>
                  <td className="py-2 px-4 text-[#D4D4D4]">{e.role}</td>
                  <td className="py-2 px-4 text-[#D4D4D4]">{e.phone}</td>
                  <td className="py-2 px-4">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/admin/employees/view/${e.id}`}><IconButton size="small" sx={{ color: '#e53935' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/admin/employees/edit/${e.id}`}><IconButton size="small" sx={{ color: '#D4D4D4' }}><EditIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: '#e53935' }}><DeleteIcon /></IconButton></Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  );
} 