import express from 'express';
import {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getSpeciesAndBreeds,
} from '../controllers/petController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import {
  createPetRules,
  updatePetRules,
  validate,
} from '../validators/petValidator.js';

const router = express.Router();

router.get('/filters', getSpeciesAndBreeds);
router.get('/', optionalAuth, getPets);
router.get('/:id', getPetById);

router.use(protect);
router.use(authorize('admin'));
router.post('/', createPetRules, validate, createPet);
router.put('/:id', updatePetRules, validate, updatePet);
router.delete('/:id', deletePet);

export default router;
