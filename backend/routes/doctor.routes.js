const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctor.controller');

router.get('/', doctorController.getAllDoctors);
router.get('/:id/slots', doctorController.getAvailableSlots);

module.exports = router; 