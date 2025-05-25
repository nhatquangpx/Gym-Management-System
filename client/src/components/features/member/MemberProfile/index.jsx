import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';

const MemberProfile = () => {
  const { user } = useSelector(state => state.auth);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/users/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Name</Typography>
            <Typography variant="body1">{profile.name}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Email</Typography>
            <Typography variant="body1">{profile.email}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Phone</Typography>
            <Typography variant="body1">{profile.phone || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Gender</Typography>
            <Typography variant="body1">{profile.gender || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Date of Birth</Typography>
            <Typography variant="body1">
              {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not provided'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1">Job</Typography>
            <Typography variant="body1">{profile.job || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Address</Typography>
            <Typography variant="body1">{profile.address || 'Not provided'}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">Membership</Typography>
            <Typography variant="body1">
              From: {new Date(profile.membershipStart).toLocaleDateString()}
              {profile.membershipEnd && ` To: ${new Date(profile.membershipEnd).toLocaleDateString()}`}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary">
              Edit Profile
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default MemberProfile; 
