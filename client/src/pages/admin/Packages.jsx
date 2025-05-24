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
  const [searchName, setSearchName] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  // Lọc danh sách gói tập theo tên, giá, trạng thái
  const filteredPackages = packages.filter(p =>
    p.name.toLowerCase().includes(searchName.toLowerCase()) &&
    p.price.includes(searchPrice) &&
    p.status.toLowerCase().includes(searchStatus.toLowerCase())
  );
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', marginBottom: 32 }}>
          Danh sách gói tập
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
      {/* Thanh tìm kiếm */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Tìm theo tên gói"
          className="p-2 rounded border border-gray-300 min-w-[200px]"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Giá"
          className="p-2 rounded border border-gray-300 min-w-[120px]"
          value={searchPrice}
          onChange={e => setSearchPrice(e.target.value)}
        />
        <input
          type="text"
          placeholder="Trạng thái"
          className="p-2 rounded border border-gray-300 min-w-[120px]"
          value={searchStatus}
          onChange={e => setSearchStatus(e.target.value)}
        />
      </div>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Tên gói tập</th>
                <th className="py-3 px-4 text-center">Giá</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredPackages.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-4">Không có gói tập nào</td></tr>
              ) : filteredPackages.map((p) => (
                <tr key={p.id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    <span className="flex items-center gap-2 justify-center">
                      <FitnessCenterIcon className="text-[var(--admin-primary)]" style={{ fontSize: 22 }} />
                      {p.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.price}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.status}</td>
                  <td className="px-6 py-4 text-center">
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