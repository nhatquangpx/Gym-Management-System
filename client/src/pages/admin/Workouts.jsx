import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Typography, Box, Chip, ThemeProvider, createTheme, Dialog, DialogTitle, DialogContent, DialogActions, Button
} from '@mui/material';
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

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch('/api/workouts');
      const data = await response.json();
      setWorkouts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setItemToDelete(id);
    setOpenConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await fetch(`/api/workouts/${itemToDelete}`, {
        method: 'DELETE',
      });
      fetchWorkouts();
    } catch (error) {
      console.error('Error deleting workouts:', error);
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
        <Box className="mb-6">
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
            Lịch sử tập luyện
          </Typography>
        </Box>

        <TableContainer component={Paper} className="shadow-lg rounded-lg">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-100">
                <TableCell>Hội viên</TableCell>
                <TableCell>Huấn luyện viên</TableCell>
                <TableCell>Ngày tập</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {workouts.map((workout) => (
                <TableRow key={workout._id}>
                  <TableCell>{workout.memberName}</TableCell>
                  <TableCell>{workout.trainerName}</TableCell>
                  <TableCell>{new Date(workout.date).toLocaleDateString()}</TableCell>
                  <TableCell>{workout.duration} phút</TableCell>
                  <TableCell>
                    <Chip
                      label={workout.status}
                      color={
                        workout.status === 'completed' ? 'success' :
                        workout.status === 'in-progress' ? 'warning' : 'error'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      component={Link}
                      to={`/admin/workouts/view/${workout._id}`}
                      color="primary"
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      component={Link}
                      to={`/admin/workouts/edit/${workout._id}`}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(workout._id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn xóa buổi tập này?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
            <Button color="error" onClick={handleDeleteConfirm}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
} 