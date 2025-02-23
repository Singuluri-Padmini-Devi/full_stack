import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import { format } from 'date-fns';
import api from '../services/api';

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    patientName: '',
    appointmentType: '',
    notes: ''
  });

  useEffect(() => {
    const fetchDoctorAndSlots = async () => {
      try {
        const [doctorResponse, slotsResponse] = await Promise.all([
          api.getDoctors(),
          api.getAvailableSlots(doctorId, selectedDate)
        ]);
        
        const doctorData = doctorResponse.data.find(d => d._id === doctorId);
        setDoctor(doctorData);
        setAvailableSlots(slotsResponse.data);
      } catch (error) {
        setError('Error fetching data. Please try again.');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorAndSlots();
  }, [doctorId, selectedDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createAppointment({
        doctorId,
        date: `${selectedDate}T${selectedSlot}`,
        duration: 30,
        ...formData
      });
      navigate('/appointments');
    } catch (error) {
      setError(error.response?.data?.error || 'Error booking appointment');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button onClick={() => navigate('/')} sx={{ mb: 2 }}>
        Back to Doctors
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Book Appointment with Dr. {doctor?.name}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                type="date"
                label="Select Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Time Slot</InputLabel>
                <Select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  label="Select Time Slot"
                >
                  {availableSlots.map((slot) => (
                    <MenuItem key={slot} value={slot}>
                      {slot}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Patient Name"
                value={formData.patientName}
                onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Appointment Type"
                value={formData.appointmentType}
                onChange={(e) => setFormData({ ...formData, appointmentType: e.target.value })}
                fullWidth
                required
                select
              >
                <MenuItem value="Routine Check-Up">Routine Check-Up</MenuItem>
                <MenuItem value="Ultrasound">Ultrasound</MenuItem>
                <MenuItem value="Consultation">Consultation</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={!selectedSlot || !formData.patientName || !formData.appointmentType}
              >
                Book Appointment
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AppointmentBooking; 