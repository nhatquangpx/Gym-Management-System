import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip } from '@mui/material';
import axios from 'axios';

const MemberSchedules = () => {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        // TODO: Implement API endpoint for member schedules
        const response = await axios.get('/api/schedules/member');
        setSchedules(response.data);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        My Schedule
      </Typography>
      <Grid container spacing={3}>
        {schedules.map((schedule) => (
          <Grid item xs={12} md={6} key={schedule._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {schedule.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {schedule.description}
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={new Date(schedule.startTime).toLocaleString()} 
                    color="primary" 
                    size="small" 
                    sx={{ mr: 1 }} 
                  />
                  <Chip 
                    label={`${schedule.duration} minutes`} 
                    color="secondary" 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2">
                  Trainer: {schedule.trainer?.name || 'Not assigned'}
                </Typography>
                <Typography variant="body2">
                  Location: {schedule.location || 'Main Gym'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
                <Button size="small" color="primary">
                  Join Session
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {schedules.length === 0 && (
          <Grid item xs={12}>
            <Typography>No scheduled sessions found.</Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default MemberSchedules; 