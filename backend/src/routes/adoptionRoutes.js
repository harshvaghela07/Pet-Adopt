import express from 'express';
import {
  applyToAdopt,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/adoptionController.js';
import { protect, authorize } from '../middleware/auth.js';
import {
  applyRules,
  updateStatusRules,
  validate,
} from '../validators/adoptionValidator.js';

const router = express.Router();

router.use(protect);

router.post('/apply', applyRules, validate, applyToAdopt);
router.get('/my', getMyApplications);

router.use(authorize('admin'));
router.get('/', getAllApplications);
router.put('/:id/status', updateStatusRules, validate, updateApplicationStatus);

export default router;
