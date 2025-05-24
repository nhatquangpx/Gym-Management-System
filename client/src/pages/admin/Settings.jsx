import SettingsIcon from '@mui/icons-material/Settings';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import StatusBadge from "../../components/features/admin/StatusBadge/StatusBadge";
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function Settings() {
  const settings = [
    { id: 1, name: "Cài đặt hệ thống", value: "Đang hoạt động", status: "Đang hoạt động" },
    { id: 2, name: "Cài đặt người dùng", value: "Đang hoạt động", status: "Đang hoạt động" },
    { id: 3, name: "Cài đặt bảo mật", value: "Đang hoạt động", status: "Đang hoạt động" },
  ];
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };
  const handleDeleteConfirm = () => {
    // TODO: Gọi API xóa cài đặt với itemToDelete
    setOpenConfirm(false);
    setItemToDelete(null);
  };
  return (
    <div className="bg-[#181818] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">Cài đặt</h1>
      <Paper sx={{ background: '#232323', color: '#fff', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[#1f1f1f] text-[#e53935]">
                <th className="py-3 px-4 text-left">Tên cài đặt</th>
                <th className="py-3 px-4 text-left">Giá trị</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {settings.map((s) => (
                <tr key={s.id} className="border-b border-[#333] hover:bg-[#252525] transition rounded-xl">
                  <td className="py-2 px-4 flex items-center gap-3 text-white">
                    <SettingsIcon className="text-[#e53935]" />
                    <span>{s.name}</span>
                  </td>
                  <td className="py-2 px-4 text-[#D4D4D4]">{s.value}</td>
                  <td className="py-2 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><IconButton size="small" sx={{ color: '#e53935' }}><VisibilityIcon /></IconButton></Tooltip>
                      <Tooltip title="Chỉnh sửa"><IconButton size="small" sx={{ color: '#D4D4D4' }}><EditIcon /></IconButton></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: '#e53935' }} onClick={() => handleDelete(s.id)}><DeleteIcon /></IconButton></Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa cài đặt này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 