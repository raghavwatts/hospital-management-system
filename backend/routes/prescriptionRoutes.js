const express = require('express');
const router = express.Router();
const {
  getPrescriptions,
  getPrescriptionById,
  createPrescription,
  updatePrescription,
  deletePrescription,
} = require('../controllers/prescriptionController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', protect, getPrescriptions);
router.get('/:id', protect, getPrescriptionById);
router.post('/', protect, authorize('doctor'), createPrescription);
router.put('/:id', protect, authorize('doctor', 'admin'), updatePrescription);
router.delete('/:id', protect, authorize('admin'), deletePrescription);

module.exports = router;
