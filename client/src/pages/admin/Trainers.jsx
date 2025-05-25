import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

export default function Trainers() {
  const employees = [
    { id: 1, name: "Nguyễn Văn D", role: "Huấn luyện viên", phone: "0901111222", status: "Đang làm việc" },
    { id: 2, name: "Phạm Thị E", role: "Nhân viên lễ tân", phone: "0911222333", status: "Nghỉ việc" },
    { id: 3, name: "Trần Văn F", role: "Huấn luyện viên", phone: "0922333444", status: "Đang làm việc" },
  ];
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchRole, setSearchRole] = useState("");
  // Lọc danh sách huấn luyện viên (role === 'Huấn luyện viên')
  const filteredEmployees = employees.filter(e =>
    e.role === 'Huấn luyện viên' &&
    e.name.toLowerCase().includes(searchName.toLowerCase()) &&
    e.phone.includes(searchPhone) &&
    e.role.toLowerCase().includes(searchRole.toLowerCase())
  );
  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };
  const handleDeleteConfirm = () => {
    setOpenConfirm(false);
    setItemToDelete(null);
  };
  const navigate = useNavigate();
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', marginBottom: 32 }}>
          Danh sách huấn luyện viên
        </h1>
        <Link to="/admin/trainers/add">
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: 'var(--admin-primary)',
              '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
            }}
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/trainers/add')}
          >
            Thêm huấn luyện viên
          </Button>
        </Link>
      </div>
      {/* Thanh tìm kiếm */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên"
          className="p-2 rounded border border-gray-300 min-w-[200px]"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          className="p-2 rounded border border-gray-300 min-w-[200px]"
          value={searchPhone}
          onChange={e => setSearchPhone(e.target.value)}
        />
        <input
          type="text"
          placeholder="Chức vụ"
          className="p-2 rounded border border-gray-300 min-w-[200px]"
          value={searchRole}
          onChange={e => setSearchRole(e.target.value)}
        />
      </div>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Tên huấn luyện viên</th>
                <th className="py-3 px-4 text-center">Chức vụ</th>
                <th className="py-3 px-4 text-center">Số điện thoại</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">Không có huấn luyện viên nào</td></tr>
              ) : filteredEmployees.map((e) => (
                <tr key={e.id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 flex items-center gap-3 text-[var(--admin-text)] justify-center text-center">
                    <GroupIcon className="text-[var(--admin-primary)]" />
                    <span>{e.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{e.role}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{e.phone}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{e.status}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/admin/trainers/view/${e.id}`}><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/admin/trainers/edit/${e.id}`}><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: 'var(--admin-primary)' }} onClick={() => handleDelete(e.id)}><DeleteIcon /></IconButton></Tooltip>
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
        <DialogContent>Bạn có chắc chắn muốn xóa huấn luyện viên này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 