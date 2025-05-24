import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Button, IconButton, Typography, Box, Chip, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4f8cff',
    },
  },
});

export default function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/equipment');
      const data = await response.json();
      setEquipment(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`/api/equipment/${itemToDelete}`, {
        method: 'DELETE',
      });
      fetchEquipment();
    } catch (error) {
      console.error('Error deleting equipment:', error);
    }
    setOpenConfirm(false);
    setItemToDelete(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="p-6">
        <Box className="flex justify-between items-center mb-6">
          <Typography 
            variant="h4" 
            className="font-bold" 
            sx={{ 
              color: '#4f8cff', 
              fontWeight: 700, 
              fontSize: '2.2em', 
              mb: 4 
            }}
          >
            Quản lý thiết bị
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            component={Link}
            to="/admin/equipment/add"
          >
            Thêm thiết bị
          </Button>
        </Box>

        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Tên thiết bị</TableCell>
                <TableCell>Loại</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Ngày bảo trì</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {equipment.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.status}
                      color={item.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{new Date(item.maintenanceDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/admin/equipment/view/${item._id}`}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/admin/equipment/edit/${item._id}`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(item._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn xóa thiết bị này?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
            <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
} 