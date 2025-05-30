import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  FitnessCenter as FitnessIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  DirectionsRun as RunIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import axios from "axios";

const ViewWorkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await axios.get(`/api/workouts/${id}`);
        setWorkout(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch workout details");
        setLoading(false);
      }
    };

    fetchWorkout();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!workout) return <Typography>Workout not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Workout Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/staff/workouts/edit/${id}`)}
          >
            Edit Workout
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Workout Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FitnessIcon sx={{ mr: 1 }} />
                <Typography variant="h6">{workout.name}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TimerIcon sx={{ mr: 1 }} />
                <Typography>Duration: {workout.duration} minutes</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <RunIcon sx={{ mr: 1 }} />
                <Typography>
                  Level:{" "}
                  <Chip
                    label={workout.level}
                    color={
                      workout.level === "beginner"
                        ? "success"
                        : workout.level === "intermediate"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TimeIcon sx={{ mr: 1 }} />
                <Typography>Type: {workout.type}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Trainer Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <PersonIcon sx={{ mr: 1 }} />
                <Typography>
                  {workout.trainer?.firstName} {workout.trainer?.lastName}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Email: {workout.trainer?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {workout.trainer?.phone}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Workout Description
              </Typography>
              <Typography paragraph>{workout.description}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Exercises
              </Typography>
              <List>
                {workout.exercises?.map((exercise, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <FitnessIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={exercise.name}
                      secondary={`${exercise.sets} sets x ${exercise.reps} reps`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {workout.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Additional Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {workout.notes}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewWorkout; 