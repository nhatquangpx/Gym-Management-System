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
  Event as EventIcon,
  Person as PersonIcon,
  FitnessCenter as FitnessIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import axios from "axios";
import { format } from "date-fns";

const ViewSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get(`/api/schedules/${id}`);
        setSchedule(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch schedule details");
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!schedule) return <Typography>Schedule not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4" component="h1">
            Schedule Details
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/staff/schedules/edit/${id}`)}
          >
            Edit Schedule
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Schedule Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <EventIcon sx={{ mr: 1 }} />
                <Typography>
                  Date: {format(new Date(schedule.date), "PPP")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <TimeIcon sx={{ mr: 1 }} />
                <Typography>
                  Time: {format(new Date(schedule.startTime), "p")} -{" "}
                  {format(new Date(schedule.endTime), "p")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <LocationIcon sx={{ mr: 1 }} />
                <Typography>Location: {schedule.location}</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <FitnessIcon sx={{ mr: 1 }} />
                <Typography>
                  Status:{" "}
                  <Chip
                    label={schedule.status}
                    color={
                      schedule.status === "confirmed"
                        ? "success"
                        : schedule.status === "pending"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                </Typography>
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
                  {schedule.trainer?.firstName} {schedule.trainer?.lastName}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Email: {schedule.trainer?.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Phone: {schedule.trainer?.phone}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Session Details
              </Typography>
              <Typography paragraph>{schedule.description}</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Participants
              </Typography>
              <List>
                {schedule.participants?.map((participant, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={`${participant.firstName} ${participant.lastName}`}
                      secondary={participant.email}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {schedule.notes && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Additional Notes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {schedule.notes}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ViewSchedule; 