import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField, MenuItem, Select, InputLabel, FormControl, Button, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddButton from '../../components/AddButton';

// Fake data for demonstration
const fakeOrders = [
  {
    _id: '1',
    user: { name: 'Nguyễn Văn A', email: 'nguyenvana@gmail.com' },
    package: { name: 'Gói 1 tháng', price: 500000 },
    amount: 500000,
    status: 'pending',
    createdAt: '2024-06-01T10:00:00Z',
    orderType: 'bank_transfer',
  },
  {
    _id: '2',
    user: { name: 'Trần Thị B', email: 'tranthib@gmail.com' },
    package: { name: 'Gói 3 tháng', price: 1200000 },
    amount: 1200000,
    status: 'paid',
    createdAt: '2024-06-02T14:30:00Z',
    orderType: 'momo',
  },
  {
    _id: '3',
    user: { name: 'Lê Văn C', email: 'levanc@gmail.com' },
    package: { name: 'Gói 6 tháng', price: 2000000 },
    amount: 2000000,
    status: 'failed',
    createdAt: '2024-06-03T09:15:00Z',
    orderType: 'bank_transfer',
  },
];

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'pending', label: 'Chờ thanh toán' },
  { value: 'paid', label: 'Đã thanh toán' },
  { value: 'failed', label: 'Thất bại' },
];

export default function StaffOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ user: '', status: '', package: '' });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    // In real app, fetch from API
    setOrders(fakeOrders);
    setLoading(false);
  }, []);

  const handleView = (order) => {
    setSelectedOrder(order);
    setOpenDetail(true);
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setOpenEdit(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      setOrders(orders.filter(o => o._id !== id));
    }
  };

  const handleStatusChange = (e) => {
    setSelectedOrder({ ...selectedOrder, status: e.target.value });
  };

  const handleSaveStatus = () => {
    setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, status: selectedOrder.status } : o));
    setOpenEdit(false);
  };

  const filteredOrders = orders.filter(o =>
    (filter.user === '' || (o.user.name && o.user.name.toLowerCase().includes(filter.user.toLowerCase()))) &&
    (filter.status === '' || o.status === filter.status) &&
    (filter.package === '' || (o.package.name && o.package.name.toLowerCase().includes(filter.package.toLowerCase())))
  );

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold" sx={{ color: 'var(--admin-text)' }}>Quản lý đơn hàng</Typography>
        <AddButton label="Tạo đơn hàng thủ công" onClick={() => alert('Chức năng này chỉ demo UI!')} />
      </Box>
      <Paper className="p-4 mb-4" sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Khách hàng"
            value={filter.user}
            onChange={e => setFilter(f => ({ ...f, user: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <TextField
            label="Gói tập"
            value={filter.package}
            onChange={e => setFilter(f => ({ ...f, package: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
          <FormControl size="small" style={{ minWidth: 140 }}>
            <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
            <Select
              value={filter.status}
              label="Trạng thái"
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              sx={{ color: 'var(--admin-text)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }, '.MuiSvgIcon-root': { color: 'var(--admin-text)' } }}
            >
              {statusOptions.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Paper>
      <TableContainer component={Paper} sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'var(--admin-header)' }}>
            <TableRow>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Khách hàng</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Email</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Gói tập</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Giá</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Trạng thái</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Ngày tạo</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Loại thanh toán</TableCell>
              <TableCell align="right" sx={{ color: 'var(--admin-text)' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={8} sx={{ color: 'var(--admin-text)' }}>Loading...</TableCell></TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow><TableCell colSpan={8} sx={{ color: 'var(--admin-text)' }}>Không có đơn hàng nào</TableCell></TableRow>
            ) : filteredOrders.map(order => (
              <TableRow key={order._id}>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{order.user.name}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{order.user.email}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{order.package.name}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{order.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{
                  order.status === 'pending' ? 'Chờ thanh toán' :
                  order.status === 'paid' ? 'Đã thanh toán' :
                  'Thất bại'
                }</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{new Date(order.createdAt).toLocaleString('vi-VN')}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{order.orderType === 'bank_transfer' ? 'Chuyển khoản' : 'Momo'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleView(order)} sx={{ color: 'var(--admin-text)' }}><VisibilityIcon /></IconButton>
                  <IconButton onClick={() => handleEdit(order)} sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(order._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Chi tiết đơn hàng */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} PaperProps={{ sx: { backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' } }}>
        <DialogTitle sx={{ color: 'var(--admin-text)' }}>Chi tiết đơn hàng</DialogTitle>
        <DialogContent dividers sx={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)' }}>
          {selectedOrder && (
            <Box>
              <Typography sx={{ color: 'var(--admin-text)' }}><b>Khách hàng:</b> {selectedOrder.user.name}</Typography>
              <Typography sx={{ color: 'var(--admin-text)' }}><b>Email:</b> {selectedOrder.user.email}</Typography>
              <Typography sx={{ color: 'var(--admin-text)' }}><b>Gói tập:</b> {selectedOrder.package.name}</Typography>
              <Typography sx={{ color: 'var(--admin-text)' }}><b>Giá:</b> {selectedOrder.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>
              <Typography sx={{ color: 'var(--admin-text)' }}><b>Trạng thái:</b> {selectedOrder.status === 'pending' ? 'Chờ thanh toán' : selectedOrder.status === 'paid' ? 'Đã thanh toán' : 'Thất bại'}</Typography>
              <Typography sx={{ color: 'var(--admin-text)' }}><b>Ngày tạo:</b> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</Typography>
              <Typography sx={{ color: 'var(--admin-text)' }}><b>Loại thanh toán:</b> {selectedOrder.orderType === 'bank_transfer' ? 'Chuyển khoản' : 'Momo'}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetail(false)} sx={{ color: 'var(--admin-text)' }}>Đóng</Button>
        </DialogActions>
      </Dialog>

      {/* Cập nhật trạng thái đơn hàng */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} PaperProps={{ sx: { backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' } }}>
        <DialogTitle sx={{ color: 'var(--admin-text)' }}>Cập nhật trạng thái đơn hàng</DialogTitle>
        <DialogContent dividers sx={{ color: 'var(--admin-text)', borderColor: 'var(--admin-border)' }}>
          {selectedOrder && (
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'var(--admin-text)' }}>Trạng thái</InputLabel>
              <Select
                value={selectedOrder.status}
                label="Trạng thái"
                onChange={handleStatusChange}
                sx={{ color: 'var(--admin-text)', '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' }, '.MuiSvgIcon-root': { color: 'var(--admin-text)' } }}
              >
                {statusOptions.filter(opt => opt.value).map(opt => (
                  <MenuItem key={opt.value} value={opt.value} sx={{ color: 'var(--admin-text)' }}>{opt.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} sx={{ color: 'var(--admin-text)' }}>Hủy</Button>
          <Button variant="contained" onClick={handleSaveStatus} sx={{ backgroundColor: 'var(--admin-primary)', color: 'var(--trainer-text)', '&:hover': { backgroundColor: 'var(--admin-accent)' } }}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 