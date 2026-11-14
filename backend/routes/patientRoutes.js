const express = require('express');
const router = express.Router();
const {
  getPatients,
  getPatientById,
  getPatientByUserId,
  createPatient,
  updatePatient,
  deletePatient,
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

// All patient routes are protected
router.get('/', protect, authorize('admin', 'doctor'), getPatients);
router.get('/user/:userId', protect, getPatientByUserId);
router.get('/:id', protect, authorize('admin', 'doctor', 'patient'), getPatientById);
router.post('/', protect, authorize('admin'), createPatient);
router.put('/:id', protect, authorize('admin', 'patient'), updatePatient);
router.delete('/:id', protect, authorize('admin'), deletePatient);

module.exports = router;
