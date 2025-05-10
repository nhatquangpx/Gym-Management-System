import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Typography, Box, Chip, Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules');
      const data = await response.json();
      setSchedules(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching schedules:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lịch tập này?')) {
      try {
        await fetch(`/api/schedules/${id}`, {
          method: 'DELETE',
        });
        fetchSchedules();
      } catch (error) {
        console.error('Error deleting schedule:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h4" className="font-bold text-gray-800">
          Quản lý lịch tập
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          component={Link}
          to="/admin/schedules/add"
        >
          Thêm lịch tập
        </Button>
      </Box>

      <TableContainer component={Paper} className="shadow-lg rounded-lg">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell>Huấn luyện viên</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Giờ bắt đầu</TableCell>
              <TableCell>Giờ kết thúc</TableCell>
              <TableCell>Loại lớp</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule._id}>
                <TableCell>{schedule.trainerName}</TableCell>
                <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                <TableCell>{schedule.startTime}</TableCell>
                <TableCell>{schedule.endTime}</TableCell>
                <TableCell>{schedule.classType}</TableCell>
                <TableCell>
                  <Chip
                    label={schedule.status}
                    color={
                      schedule.status === 'available' ? 'success' :
                      schedule.status === 'full' ? 'error' : 'warning'
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    component={Link}
                    to={`/admin/schedules/edit/${schedule._id}`}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(schedule._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
} 