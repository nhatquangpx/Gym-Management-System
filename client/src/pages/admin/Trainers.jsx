import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchSpecialization, setSearchSpecialization] = useState("");
  const [searchType, setSearchType] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await fetch('/api/trainers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setTrainers(data.data);
      }
    } catch (error) {
      console.error('Error fetching trainers:', error);
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
      const response = await fetch(`/api/trainers/${itemToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (data.success) {
        fetchTrainers(); // Refresh list after deletion
      }
    } catch (error) {
      console.error('Error deleting trainer:', error);
    }
    setOpenConfirm(false);
    setItemToDelete(null);
  };

  // Lọc danh sách huấn luyện viên
  const filteredTrainers = trainers.filter(trainer =>
    trainer.name.toLowerCase().includes(searchName.toLowerCase()) &&
    trainer.phone.includes(searchPhone) &&
    (trainer.trainerInfo?.specialization || '').toLowerCase().includes(searchSpecialization.toLowerCase()) &&
    (trainer.trainerInfo?.type || '').toLowerCase().includes(searchType.toLowerCase())
  );

  const navigate = useNavigate();

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

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
      <Paper className="p-4 mb-6" sx={{ background: 'var(--admin-sidebar)' }}>
        <div className="flex flex-wrap gap-4">
          <TextField
            label="Tìm theo tên"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Số điện thoại"
            value={searchPhone}
            onChange={e => setSearchPhone(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <TextField
            label="Chuyên môn"
            value={searchSpecialization}
            onChange={e => setSearchSpecialization(e.target.value)}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
          />
          <FormControl size="small" style={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Loại hình tập</InputLabel>
            <Select
              value={searchType}
              label="Loại hình tập"
              onChange={e => setSearchType(e.target.value)}
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
                <th className="py-3 px-4 text-center">Tên huấn luyện viên</th>
                <th className="py-3 px-4 text-center">Loại hình tập</th>
                <th className="py-3 px-4 text-center">Chuyên môn</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Số điện thoại</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainers.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">Không có huấn luyện viên nào</td></tr>
              ) : filteredTrainers.map((trainer) => (
                <tr key={trainer._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 flex items-center gap-3 text-[var(--admin-text)] justify-center text-center">
                    <GroupIcon className="text-[var(--admin-primary)]" />
                    <span>{trainer.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{trainer.trainerInfo?.type === 'gym' ? 'Gym' : 'Yoga'}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{trainer.trainerInfo?.specialization || 'Chưa cập nhật'}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{trainer.email}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{trainer.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/admin/trainers/view/${trainer._id}`}><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/admin/trainers/edit/${trainer._id}`}><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: '#d32f2f' }} onClick={() => handleDelete(trainer._id)}><DeleteIcon /></IconButton></Tooltip>
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
          <Button sx={{ color: '#d32f2f' }} onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 