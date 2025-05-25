import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
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
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import { FaPlus } from 'react-icons/fa';
import axios from '../../utils/axiosConfig';

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetch employees from API
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/employees');
      setEmployees(response.data.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Không thể tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };  const handleDelete = (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/employees/${itemToDelete}`);
      setOpenConfirm(false);
      setItemToDelete(null);
      // Reload employee list after deletion
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setError('Không thể xóa nhân viên');
      setOpenConfirm(false);
      setItemToDelete(null);
    }
  };  const navigate = useNavigate();
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [searchRole, setSearchRole] = useState("");
  
  // Lọc danh sách nhân viên từ database (role = 'employee') theo tên, số điện thoại, chức vụ
  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(searchName.toLowerCase()) &&
    e.phone.includes(searchPhone) &&
    (e.employeeInfo?.position || 'Nhân viên').toLowerCase().includes(searchRole.toLowerCase())
  );

  // Loading state
  if (loading) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-[var(--admin-text)]">Đang tải...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-[var(--admin-bg)] min-h-screen p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-[var(--admin-bg)] min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ color: 'var(--admin-primary)', fontWeight: 700, fontSize: '2.2em', marginBottom: 32 }}>
          Danh sách nhân viên/Huấn luyện viên
        </h1>
        <div className="flex justify-end">
          <Link
            to="/admin/employees/add"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FaPlus /> Thêm nhân viên
          </Link>
        </div>
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
                <th className="py-3 px-4 text-center">Tên nhân viên</th>
                <th className="py-3 px-4 text-center">Chức vụ</th>
                <th className="py-3 px-4 text-center">Số điện thoại</th>
                <th className="py-3 px-4 text-center">Trạng thái</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-4">Không có nhân viên nào</td></tr>
              ) : filteredEmployees.map((e) => (                <tr key={e._id} className="border-b border-[var(--admin-border)] hover:bg-[var(--admin-accent)] transition rounded-xl">
                  <td className="px-6 py-4 flex items-center gap-3 text-[var(--admin-text)] justify-center text-center">
                    <GroupIcon className="text-[var(--admin-primary)]" />
                    <span>{e.name}</span>
                  </td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{e.employeeInfo?.position || 'Nhân viên'}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{e.phone}</td>
                  <td className="px-6 py-4 text-[var(--admin-text)] text-center">{e.isActive ? 'Đang làm việc' : 'Nghỉ việc'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center">
                      <Tooltip title="Xem chi tiết"><Link to={`/admin/employees/view/${e._id}`}><IconButton size="small" sx={{ color: 'var(--admin-primary)' }}><VisibilityIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Chỉnh sửa"><Link to={`/admin/employees/edit/${e._id}`}><IconButton size="small" sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton></Link></Tooltip>
                      <Tooltip title="Xóa"><IconButton size="small" sx={{ color: 'var(--admin-primary)' }} onClick={() => handleDelete(e._id)}><DeleteIcon /></IconButton></Tooltip>
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
        <DialogContent>Bạn có chắc chắn muốn xóa nhân viên này?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 