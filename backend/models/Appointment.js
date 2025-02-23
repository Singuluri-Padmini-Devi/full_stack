const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor',
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  duration: { 
    type: Number, 
    required: true,
    default: 30 // default 30 minutes
  },
  appointmentType: { 
    type: String, 
    required: true 
  },
  patientName: { 
    type: String, 
    required: true 
  },
  notes: { 
    type: String 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema); 