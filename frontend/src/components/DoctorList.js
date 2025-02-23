import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  CircularProgress
} from '@mui/material';
import api from '../services/api';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.getDoctors();
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            BabySteps Appointment System
          </Typography>
          <Button color="inherit" onClick={() => navigate('/appointments')}>
            View Appointments
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Select a Doctor
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {doctors.map((doctor) => (
              <Grid item xs={12} sm={6} md={4} key={doctor._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Dr. {doctor.name}
                    </Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {doctor.specialization}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Working Hours: {doctor.workingHours.start} - {doctor.workingHours.end}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate(`/book/${doctor._id}`)}
                      sx={{ mt: 2 }}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default DoctorList; 