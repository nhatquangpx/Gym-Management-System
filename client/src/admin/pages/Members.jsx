import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Paper, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge/StatusBadge';

export default function Members() {
  const members = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com', phone: '0901234567', status: 'Đang hoạt động', joinDate: '01/01/2023' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@gmail.com', phone: '0912345678', status: 'Đang hoạt động', joinDate: '15/02/2023' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@gmail.com', phone: '0923456789', status: 'Tạm dừng', joinDate: '01/03/2023' },
  ];
  return (
    <div className="bg-[#181818] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Quản lý thành viên</h1>
      <Paper sx={{ background: '#232323', color: '#fff', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[#1f1f1f] text-[#e53935]">
                <th className="px-6 py-3 text-left">Thành viên</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Số điện thoại</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
                <th className="px-6 py-3 text-left">Ngày tham gia</th>
                <th className="px-6 py-3 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-[#333] hover:bg-[#252525] transition rounded-xl">
                  <td className="px-6 py-4 flex items-center gap-3 text-white">
                    <GroupIcon className="text-[#e53935]" />
                    <span>{member.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[#D4D4D4]">{member.email}</td>
                  <td className="px-6 py-4 text-[#D4D4D4]">{member.phone}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={member.status} />
                  </td>
                  <td className="px-6 py-4 text-[#D4D4D4]">{member.joinDate}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/members/view/${member.id}`}><IconButton size="small" sx={{ color: '#e53935' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/members/edit/${member.id}`}><IconButton size="small" sx={{ color: '#D4D4D4' }}><EditIcon /></IconButton></Link></Tooltip>
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