import express from 'express';
import { getUsers, deleteUser, createUser, updateUserRole } from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';
import { createUserRules, updateRoleRules, validate } from '../validators/userValidator.js';

const router = express.Router();
router.use(protect, authorize('admin'));

router.get('/', getUsers);
router.post('/', createUserRules, validate, createUser);
router.put('/:id/role', updateRoleRules, validate, updateUserRole);
router.delete('/:id', deleteUser);

export default router;
