const express = require('express');
const router = express.Router();
const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getStats,
} = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All appointment routes are protected
router.get('/stats', protect, authorize('admin'), getStats);
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.post('/', protect, authorize('patient'), createAppointment);
router.put('/:id', protect, authorize('admin', 'doctor'), updateAppointment);
router.delete('/:id', protect, deleteAppointment);

module.exports = router;
