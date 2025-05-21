import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Paper, Typography, Box, Grid, Chip, Button,
  Card, CardContent, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';

export default function ViewEquipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEquipment();
  }, [id]);

  const fetchEquipment = async () => {
    try {
      const response = await fetch(`/api/equipment/${id}`);
      const data = await response.json();
      setEquipment(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!equipment) {
    return <div>Equipment not found</div>;
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
          startIcon={<EditIcon />}
          onClick={() => navigate(`/admin/equipment/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>

      <Paper className="p-6 shadow-lg rounded-lg">
        <Typography variant="h4" className="font-bold text-gray-800 mb-6">
          Chi tiết thiết bị
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Thông tin cơ bản
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Tên thiết bị
                    </Typography>
                    <Typography variant="body1">{equipment.name}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Loại thiết bị
                    </Typography>
                    <Typography variant="body1">{equipment.type}</Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Trạng thái
                    </Typography>
                    <Chip
                      label={equipment.status}
                      color={equipment.status === 'active' ? 'success' : 'error'}
                      size="small"
                    />
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" className="font-semibold mb-4">
                  Thông tin bảo trì
                </Typography>
                <Box className="space-y-4">
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ngày bảo trì gần nhất
                    </Typography>
                    <Typography variant="body1">
                      {new Date(equipment.maintenanceDate).toLocaleDateString()}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="subtitle2" color="textSecondary">
                      Ghi chú bảo trì
                    </Typography>
                    <Typography variant="body1">
                      {equipment.maintenanceNotes || 'Không có ghi chú'}
                    </Typography>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
} 