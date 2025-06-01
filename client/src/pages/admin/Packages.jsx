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
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

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
      const response = await fetch('http://localhost:8001/api/packages');
      
      if (!response.ok) {
        throw new Error(`Lỗi kết nối: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Định dạng lại giá để hiển thị
      const formattedPackages = data.map(pkg => ({
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
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập lại để thực hiện chức năng này.');
        setTimeout(() => navigate('/auth/login'), 2000);
        return;
      }
      
      const response = await fetch(`http://localhost:8001/api/packages/${itemToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        // Tải lại danh sách gói tập sau khi xóa
        fetchPackages();
        alert('Xóa gói tập thành công!');
      } else {
        const errorData = await response.json();
        console.error('Không thể xóa gói tập:', errorData.message || response.statusText);
        setError(`Lỗi: ${errorData.message || 'Không thể xóa gói tập. Vui lòng thử lại sau.'}`);
        
        // Nếu lỗi là do xác thực, chuyển hướng đến trang đăng nhập
        if (response.status === 401 || response.status === 403) {
          alert('Phiên đăng nhập hết hạn hoặc không có quyền. Vui lòng đăng nhập lại.');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setTimeout(() => navigate('/auth/login'), 1000);
        }
      }
    } catch (err) {
      console.error('Lỗi khi xóa gói tập:', err);
      setError(`Lỗi: ${err.message}`);
    } finally {
      setOpenConfirm(false);
      setItemToDelete(null);
    }
  };
  
  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [searchType, setSearchType] = useState("");  // Lọc theo loại gói
  const [searchTypePackage, setSearchTypePackage] = useState(""); // Lọc theo loại hình tập
  const filteredPackages = packages.filter(p =>
    (p.name && p.name.toLowerCase().includes(searchName.toLowerCase())) &&
    (p.formattedPrice && p.formattedPrice.includes(searchPrice)) &&
    (p.type && p.type.toLowerCase().includes(searchType.toLowerCase())) &&
    (p.typePackage && p.typePackage.toLowerCase().includes(searchTypePackage.toLowerCase()))
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
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      {/* Thanh tìm kiếm */}
      <Paper className="p-4 mb-6" sx={{ background: 'var(--admin-sidebar)' }}>
        <div className="flex flex-wrap gap-4">
          <TextField
            label="Tìm theo tên gói"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Giá"
            value={searchPrice}
            onChange={e => setSearchPrice(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Loại gói</InputLabel>
            <Select
              value={searchType}
              label="Loại gói"
              onChange={e => setSearchType(e.target.value)}
              sx={{ color: 'var(--admin-text)' }}
            >
              <MenuItem value="">Tất cả loại gói</MenuItem>
              <MenuItem value="Tự tập">Tự tập</MenuItem>
              <MenuItem value="Tập với PT">Tập với PT</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Loại hình tập</InputLabel>
            <Select
              value={searchTypePackage}
              label="Loại hình tập"
              onChange={e => setSearchTypePackage(e.target.value)}
              sx={{ color: 'var(--admin-text)' }}
            >
              <MenuItem value="">Tất cả</MenuItem>
              <MenuItem value="gym">Gym</MenuItem>
              <MenuItem value="yoga">Yoga</MenuItem>
            </Select>
          </FormControl>
        </div>
      </Paper>
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="py-3 px-4 text-center">Tên gói tập</th>
                <th className="py-3 px-4 text-center">Loại hình tập</th>
                <th className="py-3 px-4 text-center">Loại gói</th>
                <th className="py-3 px-4 text-center">Giá</th>
                <th className="py-3 px-4 text-center">Thời hạn</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    <CircularProgress size={24} sx={{ color: 'var(--admin-primary)' }} />
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </td>
                </tr>
              ) : filteredPackages.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có gói tập nào</td></tr>
              ) : filteredPackages.map((p) => (
                <tr key={p._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition">
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">
                    <span className="flex items-center gap-2 justify-center">
                      <FitnessCenterIcon className="text-[var(--admin-primary)]" style={{ fontSize: 22 }} />
                      {p.name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.typePackage === 'gym' ? 'Gym' : 'Yoga'}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.type}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.formattedPrice}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{p.duration} ngày</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/admin/packages/view/${p._id}`}><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/admin/packages/edit/${p._id}`}><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Link></Tooltip>
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
          <Button sx={{ color: '#d32f2f' }} onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 