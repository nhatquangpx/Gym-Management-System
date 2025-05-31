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
import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, TextField, MenuItem, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  useEffect(() => {
    fetchPackages();
  }, []);
  
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/packages');
      
      // Định dạng lại giá để hiển thị
      const formattedPackages = response.data.map(pkg => ({
        ...pkg,
        formattedPrice: new Intl.NumberFormat('vi-VN').format(pkg.price) + pkg.period,
        status: "Đang mở bán" // Giả định tất cả các gói đều đang mở bán
      }));
      
      setPackages(formattedPackages);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải gói tập:', err);
      setError('Không thể tải danh sách gói tập. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/packages/${itemToDelete}`);
      // Tải lại danh sách gói tập sau khi xóa
      fetchPackages();
      alert('Xóa gói tập thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa gói tập:', err);
      setError(err.response?.data?.message || 'Không thể xóa gói tập. Vui lòng thử lại sau.');
      
      // Nếu lỗi là do xác thực, chuyển hướng đến trang đăng nhập
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setTimeout(() => navigate('/auth/login'), 1000);
      }
    } finally {
      setOpenConfirm(false);
      setItemToDelete(null);
    }
  };
  
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [searchType, setSearchType] = useState("");  // Lọc theo loại gói
  const filteredPackages = packages.filter(p =>
    (p.name && p.name.toLowerCase().includes(searchName.toLowerCase())) &&
    (p.formattedPrice && p.formattedPrice.includes(searchPrice)) &&
    (p.type && p.type.toLowerCase().includes(searchType.toLowerCase()))
  );
  
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', marginBottom: 32 }}>
          Danh sách gói tập
        </h1>
        <Link to="/staff/packages/add">
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: 'var(--admin-primary)',
              '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
            }}
            startIcon={<AddIcon />}
            onClick={() => navigate('/staff/packages/add')}
          >
            Thêm gói tập
          </Button>
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Thanh tìm kiếm */}
      <Paper sx={{ p: 2, mb: 3, background: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Tìm theo tên gói"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            label="Giá"
            value={searchPrice}
            onChange={e => setSearchPrice(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            select
            label="Loại gói"
            value={searchType}
            onChange={e => setSearchType(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }, minWidth: 150 }}
          >
            <MenuItem value="">Tất cả loại gói</MenuItem>
            <MenuItem value="Tự tập">Tự tập</MenuItem>
            <MenuItem value="Tập với PT">Tập với PT</MenuItem>
          </TextField>
        </Box>
      </Paper>

      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-left">Tên gói tập</th>
                <th className="py-3 px-4 text-left">Giá</th>
                <th className="py-3 px-4 text-left">Loại gói</th>
                <th className="py-3 px-4 text-left">Thời hạn</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <CircularProgress size={24} sx={{ color: 'var(--admin-primary)' }} />
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">Không có gói tập nào</td></tr>
              ) : filteredPackages.map((p) => (
                <tr key={p._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">
                    <span className="flex items-center gap-2 justify-start">
                      <FitnessCenterIcon className="text-[var(--admin-primary)]" style={{ fontSize: 22 }} />
                      {p.name}
                    </span>
                  </td>
                  <td className="px-3 py-4 text-[var(--admin-text)] text-left">{p.formattedPrice}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{p.type}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-left">{p.duration} ngày</td>
                  <td className="px-6 py-4 text-left">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/staff/packages/view/${p._id}`}><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/staff/packages/edit/${p._id}`}><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: '#d32f2f' }} onClick={() => handleDelete(p._id)}><DeleteIcon /></IconButton></Tooltip>
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