import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DoctorList from './components/DoctorList';
import AppointmentBooking from './components/AppointmentBooking';
import AppointmentList from './components/AppointmentList';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<DoctorList />} />
          <Route path="/book/:doctorId" element={<AppointmentBooking />} />
          <Route path="/appointments" element={<AppointmentList />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 