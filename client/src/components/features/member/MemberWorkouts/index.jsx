import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import axios from 'axios';

const MemberWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        // TODO: Implement API endpoint for member workouts
        const response = await axios.get('/api/workouts/member');
        setWorkouts(response.data);
      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Workouts
      </Typography>
      <Grid container spacing={3}>
        {workouts.map((workout) => (
          <Grid item xs={12} md={6} key={workout._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {workout.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {workout.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip label={workout.difficulty} color="primary" size="small" sx={{ mr: 1 }} />
                  <Chip label={`${workout.duration} minutes`} color="secondary" size="small" />
                </Box>
                <Typography variant="body2">
                  Trainer: {workout.trainer?.name || 'Not assigned'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                <Button size="small" color="primary">
                  Start Workout
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {workouts.length === 0 && (
          <Grid item xs={12}>
            <Typography>No workouts assigned yet.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MemberWorkouts; 
