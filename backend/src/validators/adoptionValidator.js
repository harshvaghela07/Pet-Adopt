import { body, param, validationResult } from 'express-validator';

export const applyRules = [
  body('petId').isMongoId().withMessage('Invalid pet ID'),
  body('message').optional().trim().isLength({ max: 300 }),
];

export const updateStatusRules = [
  param('id').isMongoId().withMessage('Invalid application ID'),
  body('status').isIn(['approved', 'rejected']).withMessage('Status must be approved or rejected'),
  body('adminNotes').optional().trim(),
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
