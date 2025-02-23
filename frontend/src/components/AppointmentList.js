import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  CircularProgress,
  Alert
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { format } from 'date-fns';
import api from '../services/api';

const AppointmentList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, appointmentId: null });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await api.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      setError('Error fetching appointments');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteAppointment(deleteDialog.appointmentId);
      setDeleteDialog({ open: false, appointmentId: null });
      fetchAppointments();
    } catch (error) {
      setError('Error deleting appointment');
      console.error('Error:', error);
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
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Appointments
          </Typography>
          <Button color="inherit" onClick={() => navigate('/')}>
            Book New Appointment
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Patient Name</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No appointments found
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appointment) => (
                    <TableRow key={appointment._id}>
                      <TableCell>{appointment.patientName}</TableCell>
                      <TableCell>Dr. {appointment.doctorId.name}</TableCell>
                      <TableCell>
                        {format(new Date(appointment.date), 'PPpp')}
                      </TableCell>
                      <TableCell>{appointment.appointmentType}</TableCell>
                      <TableCell>
                        <IconButton 
                          color="primary"
                          onClick={() => navigate(`/edit/${appointment._id}`)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => setDeleteDialog({ 
                            open: true, 
                            appointmentId: appointment._id 
                          })}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, appointmentId: null })}
        >
          <DialogTitle>Confirm Cancellation</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to cancel this appointment?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setDeleteDialog({ open: false, appointmentId: null })}
            >
              No, Keep It
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Yes, Cancel It
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default AppointmentList; 