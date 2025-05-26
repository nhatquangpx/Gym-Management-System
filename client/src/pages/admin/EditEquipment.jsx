import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Grid, TextField, Button,
  MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

export default function EditEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState({
    name: '',
    type: '',
    status: 'active',
    maintenanceDate: '',
    maintenanceNotes: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEquipment();
    } else {
      setLoading(false);
    }
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`/api/equipments/${id}`);
      const data = await response.json();
      setEquipment({
        ...data,
        maintenanceDate: new Date(data.maintenanceDate).toISOString().split('T')[0]
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEquipment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/equipments/${id}` : '/api/equipments';
      
      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(equipment),
      });
      
      navigate('/admin/equipment');
    } catch (error) {
      console.error('Error saving equipment:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Box className="flex justify-between items-center mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/admin/equipment')}
        >
          Quay lại
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSubmit}
        >
          Lưu thay đổi
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          {id ? 'Chỉnh sửa thiết bị' : 'Thêm thiết bị mới'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tên thiết bị"
                name="name"
                value={equipment.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="Loại thiết bị"
                name="type"
                value={equipment.type}
                onChange={handleChange}
                required
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={equipment.status}
                  onChange={handleChange}
                  label="Trạng thái"
                >
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="maintenance">Bảo trì</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Ngày bảo trì"
                name="maintenanceDate"
                type="date"
                value={equipment.maintenanceDate}
                onChange={handleChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                fullWidth
                label="Ghi chú bảo trì"
                name="maintenanceNotes"
                value={equipment.maintenanceNotes}
                onChange={handleChange}
                margin="normal"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
} 