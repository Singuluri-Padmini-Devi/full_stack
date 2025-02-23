import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = {
  // Doctor endpoints
  getDoctors: () => 
    axios.get(`${API_URL}/doctors`),
  
  getAvailableSlots: (doctorId, date) => 
    axios.get(`${API_URL}/doctors/${doctorId}/slots?date=${date}`),

  // Appointment endpoints
  getAppointments: () => 
    axios.get(`${API_URL}/appointments`),
  
  getAppointment: (id) => 
    axios.get(`${API_URL}/appointments/${id}`),
  
  createAppointment: (appointmentData) => 
    axios.post(`${API_URL}/appointments`, appointmentData),
  
  updateAppointment: (id, appointmentData) => 
    axios.put(`${API_URL}/appointments/${id}`, appointmentData),
  
  deleteAppointment: (id) => 
    axios.delete(`${API_URL}/appointments/${id}`)
};

export default api; 