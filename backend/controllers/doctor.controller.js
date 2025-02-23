const Doctor = require('../models/Doctor');
const { parseISO, format, eachMinuteOfInterval, isWithinInterval } = require('date-fns');
const Appointment = require('../models/Appointment');

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query;

    const doctor = await Doctor.findById(id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Get all appointments for the doctor on the specified date
    const appointments = await Appointment.find({
      doctorId: id,
      date: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setDate(new Date(date).getDate() + 1))
      }
    });

    // Calculate available slots
    const workStart = parseISO(`${date}T${doctor.workingHours.start}`);
    const workEnd = parseISO(`${date}T${doctor.workingHours.end}`);

    // Generate all possible 30-minute slots
    const allSlots = eachMinuteOfInterval(
      { start: workStart, end: workEnd },
      { step: 30 }
    );

    // Filter out slots that overlap with existing appointments
    const availableSlots = allSlots.filter(slot => {
      const slotEnd = new Date(slot.getTime() + 30 * 60000);
      return !appointments.some(apt => {
        const aptEnd = new Date(apt.date.getTime() + apt.duration * 60000);
        return isWithinInterval(slot, { start: apt.date, end: aptEnd }) ||
               isWithinInterval(slotEnd, { start: apt.date, end: aptEnd });
      });
    });

    res.json(availableSlots.map(slot => format(slot, 'HH:mm')));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 