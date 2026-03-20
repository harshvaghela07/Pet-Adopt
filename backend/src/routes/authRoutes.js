import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerRules, loginRules, validate } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', protect, getMe);

export default router;
