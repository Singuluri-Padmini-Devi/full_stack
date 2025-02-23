const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { parseISO, isWithinInterval } = require('date-fns');

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('doctorId', 'name specialization')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('doctorId', 'name specialization');
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAppointment = async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if the slot is within doctor's working hours
    const appointmentDate = parseISO(date);
    const workStart = parseISO(`${date.split('T')[0]}T${doctor.workingHours.start}`);
    const workEnd = parseISO(`${date.split('T')[0]}T${doctor.workingHours.end}`);

    if (!isWithinInterval(appointmentDate, { start: workStart, end: workEnd })) {
      return res.status(400).json({ error: 'Appointment time is outside working hours' });
    }

    // Check for overlapping appointments
    const appointmentEnd = new Date(appointmentDate.getTime() + duration * 60000);
    const overlappingAppointment = await Appointment.findOne({
      doctorId,
      date: {
        $lt: appointmentEnd,
        $gt: appointmentDate
      }
    });

    if (overlappingAppointment) {
      return res.status(400).json({ error: 'Time slot is already booked' });
    }

    const appointment = new Appointment({
      doctorId,
      date: appointmentDate,
      duration,
      appointmentType,
      patientName,
      notes
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { doctorId, date, duration, appointmentType, patientName, notes } = req.body;
    const appointmentId = req.params.id;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    // If date or duration is being updated, check for conflicts
    if (date || duration) {
      const appointmentDate = date ? parseISO(date) : appointment.date;
      const appointmentDuration = duration || appointment.duration;
      const appointmentEnd = new Date(appointmentDate.getTime() + appointmentDuration * 60000);

      const overlappingAppointment = await Appointment.findOne({
        doctorId: doctorId || appointment.doctorId,
        _id: { $ne: appointmentId },
        date: {
          $lt: appointmentEnd,
          $gt: appointmentDate
        }
      });

      if (overlappingAppointment) {
        return res.status(400).json({ error: 'Time slot is already booked' });
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        doctorId: doctorId || appointment.doctorId,
        date: date ? parseISO(date) : appointment.date,
        duration: duration || appointment.duration,
        appointmentType: appointmentType || appointment.appointmentType,
        patientName: patientName || appointment.patientName,
        notes: notes || appointment.notes
      },
      { new: true }
    );

    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 