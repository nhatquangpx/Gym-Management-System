import BarChartIcon from '@mui/icons-material/BarChart';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import StatusBadge from "../../components/features/admin/StatusBadge/StatusBadge";

export default function Statistics() {
  const statistics = [
    { id: 1, name: "Thống kê doanh thu", value: "10.000.000đ", status: "Đang cập nhật" },
    { id: 2, name: "Thống kê thành viên", value: "100", status: "Đã hoàn thành" },
    { id: 3, name: "Thống kê gói tập", value: "3", status: "Đang cập nhật" },
  ];
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-[var(--admin-text)]">Thống kê</h1>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-left">Tên thống kê</th>
                <th className="py-3 px-4 text-left">Giá trị</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {statistics.map((s) => (
                <tr key={s.id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="py-2 px-4 flex items-center gap-3 text-[var(--admin-text)]">
                    <BarChartIcon className="text-[var(--admin-primary)]" />
                    <span>{s.name}</span>
                  </td>
                  <td className="py-2 px-4 text-[var(--admin-text)]">{s.value}</td>
                  <td className="py-2 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Tooltip>
                      <Tooltip title="Chỉnh sửa"><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><DeleteIcon /></IconButton></Tooltip>
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