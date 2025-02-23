const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointment);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router; 