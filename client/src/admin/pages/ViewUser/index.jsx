import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Divider,
} from '@mui/material';
import axios from 'axios';

const ViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">User Details</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/admin/users/edit/${id}`)}
        >
          Edit User
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">{user.name}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">{user.phone || 'N/A'}</Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Role
            </Typography>
            <Chip
              label={user.role}
              color={
                user.role === 'admin'
                  ? 'error'
                  : user.role === 'trainer'
                  ? 'warning'
                  : 'success'
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>
            <Chip
              label={user.isActive ? 'Active' : 'Inactive'}
              color={user.isActive ? 'success' : 'error'}
            />
          </Grid>

          {user.role === 'member' && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Member Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Gender
                </Typography>
                <Typography variant="body1">{user.gender || 'N/A'}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Date of Birth
                </Typography>
                <Typography variant="body1">
                  {user.dateOfBirth
                    ? new Date(user.dateOfBirth).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Job
                </Typography>
                <Typography variant="body1">{user.job || 'N/A'}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">{user.address || 'N/A'}</Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Membership Start
                </Typography>
                <Typography variant="body1">
                  {new Date(user.membershipStart).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Membership End
                </Typography>
                <Typography variant="body1">
                  {user.membershipEnd
                    ? new Date(user.membershipEnd).toLocaleDateString()
                    : 'N/A'}
                </Typography>
              </Grid>
            </>
          )}

          {user.role === 'trainer' && (
            <>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                  Trainer Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">
                  Specialization
                </Typography>
                <Typography variant="body1">
                  {user.specialization || 'N/A'}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ViewUser; 