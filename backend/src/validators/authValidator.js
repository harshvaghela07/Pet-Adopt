import { body, validationResult } from 'express-validator';

export const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const loginRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};
