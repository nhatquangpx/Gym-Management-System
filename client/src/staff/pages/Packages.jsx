import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddButton from '../../components/AddButton';

export default function StaffPackages() {
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '' });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/packages');
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa gói tập này?')) {
      try {
        await fetch(`/api/packages/${id}`, { method: 'DELETE' });
        fetchPackages();
      } catch (error) {
        console.error('Error deleting package:', error);
      }
    }
  };

  const filteredPackages = packages.filter(p =>
    (filter.name === '' || (p.name && p.name.toLowerCase().includes(filter.name.toLowerCase())))
  );

  return (
    <div className="p-6" style={{ backgroundColor: 'var(--admin-bg)', color: 'var(--admin-text)' }}>
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold" sx={{ color: 'var(--admin-text)' }}>Danh sách gói tập</Typography>
        <AddButton 
          onClick={() => navigate('/staff/packages/add')}
          label="Thêm gói tập"
        />
      </Box>
      <Paper className="p-4 mb-4" sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Box className="flex flex-wrap gap-4">
          <TextField
            label="Tìm theo tên"
            value={filter.name}
            onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
            size="small"
            InputLabelProps={{ style: { color: 'var(--admin-text)' } }}
            InputProps={{ style: { color: 'var(--admin-text)' } }}
            sx={{ '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-border)' }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--admin-primary)' } }}
          />
        </Box>
      </Paper>
      <TableContainer component={Paper} sx={{ backgroundColor: 'var(--admin-sidebar)', color: 'var(--admin-text)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: 'var(--admin-header)' }}>
            <TableRow>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Tên gói tập</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Giá</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Thời hạn</TableCell>
              <TableCell sx={{ color: 'var(--admin-text)' }}>Trạng thái</TableCell>
              <TableCell align="right" sx={{ color: 'var(--admin-text)' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} sx={{ color: 'var(--admin-text)' }}>Loading...</TableCell></TableRow>
            ) : filteredPackages.length === 0 ? (
              <TableRow><TableCell colSpan={5} sx={{ color: 'var(--admin-text)' }}>Không có gói tập nào</TableCell></TableRow>
            ) : filteredPackages.map(p => (
              <TableRow key={p._id}>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{p.name}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{p.price}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{p.duration}</TableCell>
                <TableCell sx={{ color: 'var(--admin-text)' }}>{p.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/staff/packages/${p._id}`)} sx={{ color: 'var(--admin-text)' }}><VisibilityIcon /></IconButton>
                  <IconButton onClick={() => navigate(`/staff/packages/edit/${p._id}`)} sx={{ color: 'var(--admin-text)' }}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 