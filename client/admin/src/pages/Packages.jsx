import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import StatusBadge from '../components/StatusBadge/StatusBadge';

export default function Packages() {
  const packages = [
    { id: 1, name: "Gói 1 tháng", price: "500.000đ", status: "Đang mở bán" },
    { id: 2, name: "Gói 3 tháng", price: "1.200.000đ", status: "Đang mở bán" },
    { id: 3, name: "Gói 6 tháng", price: "2.000.000đ", status: "Tạm dừng" },
  ];
  return (
    <div className="bg-[#181818] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Quản lý gói tập</h1>
      <Paper sx={{ background: '#232323', color: '#fff', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[#1f1f1f] text-[#e53935]">
                <th className="py-3 px-4 text-left">Gói tập</th>
                <th className="py-3 px-4 text-left">Giá</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id} className="border-b border-[#333] hover:bg-[#252525] transition rounded-xl">
                  <td className="py-2 px-4 flex items-center gap-3 text-white">
                    <FitnessCenterIcon className="text-[#e53935]" />
                    <span>{p.name}</span>
                  </td>
                  <td className="py-2 px-4 text-[#D4D4D4]">{p.price}</td>
                  <td className="py-2 px-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/packages/view/${p.id}`}><IconButton size="small" sx={{ color: '#e53935' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/packages/edit/${p.id}`}><IconButton size="small" sx={{ color: '#D4D4D4' }}><EditIcon /></IconButton></Link></Tooltip>
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