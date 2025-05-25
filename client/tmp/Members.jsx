import GroupIcon from '@mui/icons-material/Group';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Paper, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import StatusBadge from "../../components/features/admin/StatusBadge/StatusBadge";
import AddButton from '../../components/AddButton';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import axios from '../../utils/axiosConfig';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Lấy danh sách thành viên từ API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        // Không cần thêm token vào headers vì đã xử lý trong axiosConfig
        const response = await axios.get('/members');
        
        // Chuyển đổi định dạng dữ liệu từ API để phù hợp với UI
        const formattedMembers = response.data.data.map(member => ({
          id: member._id,
          name: member.name || `${member.firstName || ''} ${member.lastName || ''}`,
          email: member.email,
          phone: member.phone || 'Chưa cập nhật',
          status: member.isActive !== false ? 'Đang hoạt động' : 'Tạm dừng',
          joinDate: formatDate(member.createdAt)
        }));
        
        setMembers(formattedMembers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError("Không thể tải danh sách thành viên. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };
  
  const handleDeleteConfirm = async () => {
    try {
      // Không cần thêm token vào headers vì đã xử lý trong axiosConfig
      await axios.delete(`/members/${itemToDelete}`);
      
      // Cập nhật lại danh sách sau khi xóa
      setMembers(members.filter(member => member.id !== itemToDelete));
      setOpenConfirm(false);
      setItemToDelete(null);
    } catch (err) {
      console.error("Error deleting member:", err);
      alert("Không thể xóa thành viên. Vui lòng thử lại sau.");
    }
  };
  
  // Lọc danh sách hội viên theo tên, số điện thoại, email
  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchName.toLowerCase()) &&
    member.phone.includes(searchPhone) &&
    member.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', marginBottom: 32 }}>
          Danh sách hội viên
        </h1>
        <Link to="/admin/members/add">
          <Button
            variant="contained"
            sx={{ 
              backgroundColor: 'var(--admin-primary)',
              '&:hover': { backgroundColor: 'var(--admin-primary)', opacity: 0.9 }
            }}
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/members/add')}
          >
            Thêm hội viên
          </Button>
        </Link>
      </div>
      
      {loading && <div className="text-center py-4 text-[var(--admin-text)]">Đang tải dữ liệu...</div>}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      
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
          placeholder="Email"
          className="p-2 rounded border border-gray-300 min-w-[200px]"
          value={searchEmail}
          onChange={e => setSearchEmail(e.target.value)}
        />
      </div>
      
      <Paper sx={{ background: 'var(--admin-sidebar)', color: 'var(--admin-text)', borderRadius: 4, boxShadow: 6 }}>
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-2xl">
            <thead>
              <tr className="bg-[var(--admin-header)] text-[var(--admin-primary)]">
                <th className="px-6 py-3 text-center">Tên hội viên</th>
                <th className="px-6 py-3 text-center">Số điện thoại</th>
                <th className="px-6 py-3 text-center">Email</th>
                <th className="px-6 py-3 text-center">Ngày đăng ký</th>
                <th className="px-6 py-3 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">Không có hội viên nào</td></tr>
              ) : filteredMembers.map((member) => (
                <tr key={member.id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 flex items-center gap-3 text-[var(--admin-text)] justify-center text-center">
                    <GroupIcon className="text-[var(--admin-primary)]" />
                    <span>{member.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{member.phone}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{member.email}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{member.joinDate}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/admin/members/view/${member.id}`}><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/admin/members/edit/${member.id}`}><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: 'var(--admin-primary)' }} onClick={() => handleDelete(member.id)}><DeleteIcon /></IconButton></Tooltip>
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
        <DialogContent>Bạn có chắc chắn muốn xóa thành viên này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
