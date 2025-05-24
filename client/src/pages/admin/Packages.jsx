import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import StatusBadge from "../../components/features/admin/StatusBadge/StatusBadge";
import AddButton from '../../components/AddButton';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

export default function Packages() {
  const packages = [
    { id: 1, name: "Gói 1 tháng", price: "500.000đ", status: "Đang mở bán" },
    { id: 2, name: "Gói 3 tháng", price: "1.200.000đ", status: "Đang mở bán" },
    { id: 3, name: "Gói 6 tháng", price: "2.000.000đ", status: "Tạm dừng" },
  ];
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };
  const handleDeleteConfirm = () => {
    // TODO: Gọi API xóa gói tập với itemToDelete
    setOpenConfirm(false);
    setItemToDelete(null);
  };
  const navigate = useNavigate();
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', marginBottom: 32 }}>
          Quản lý đăng ký gói tập
        </h1>
        <Link to="/admin/packages/add">
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: 'var(--admin-primary)',
              '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
            }}
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/packages/add')}
          >
            Thêm gói tập
          </Button>
        </Link>
      </div>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)] text-base">
                <th className="py-3 px-4 text-left">Gói tập</th>
                <th className="py-3 px-4 text-left">Giá</th>
                <th className="py-3 px-4 text-left">Trạng thái</th>
                <th className="py-3 px-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition">
                  <td className="py-2 px-4 flex items-center gap-3 text-[var(--admin-text)]">
                    <FitnessCenterIcon className="text-[var(--admin-primary)] mx-auto" />
                    <span>{p.name}</span>
                  </td>
                  <td className="py-2 px-4 text-[var(--admin-text)]">{p.price}</td>
                  <td className="py-2 px-4">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="py-2 px-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/admin/packages/view/${p.id}`}><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/admin/packages/edit/${p.id}`}><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: 'var(--admin-primary)' }} onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton></Tooltip>
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
        <DialogContent>Bạn có chắc chắn muốn xóa gói tập này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 