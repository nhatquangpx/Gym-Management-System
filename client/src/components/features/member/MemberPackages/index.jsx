import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button } from '@mui/material';
import axios from 'axios';

const MemberPackages = () => {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('/api/users/my-packages');
        setPackages(response.data.packages);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Packages
      </Typography>
      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} md={4} key={pkg._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {pkg.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {pkg.description}
                </Typography>
                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ${pkg.price}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Duration: {pkg.duration} months
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                <Button size="small" color="primary">
                  Renew Package
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {packages.length === 0 && (
          <Grid item xs={12}>
            <Typography>No active packages found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MemberPackages; 
