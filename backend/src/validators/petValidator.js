import { body, param, validationResult } from 'express-validator';

export const createPetRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('species').trim().notEmpty().withMessage('Species is required'),
  body('breed').trim().notEmpty().withMessage('Breed is required'),
  body('age')
    .isInt({ min: 0, max: 50 })
    .withMessage('Age must be between 0 and 50'),
  body('description').optional().trim().isLength({ max: 500 }),
  body('imageUrl').optional().trim().isURL().withMessage('Invalid image URL'),
  body('status').optional().isIn(['available', 'pending', 'adopted']),
];

export const updatePetRules = [
  param('id').isMongoId().withMessage('Invalid pet ID'),
  body('name').optional().trim().notEmpty().isLength({ max: 50 }),
  body('species').optional().trim().notEmpty(),
  body('breed').optional().trim().notEmpty(),
  body('age').optional().isInt({ min: 0, max: 50 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('imageUrl').optional().trim().isURL(),
  body('status').optional().isIn(['available', 'pending', 'adopted']),
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
