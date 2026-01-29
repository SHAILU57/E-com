const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

const validateRegister = [
  body('name').trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email').isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit mobile number'),
  
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password').notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

const validateProduct = [
  body('name').trim()
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Product name cannot exceed 100 characters'),
  
  body('description').trim()
    .notEmpty().withMessage('Product description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('price').isNumeric().withMessage('Price must be a number')
    .isFloat({ min: 0 }).withMessage('Price cannot be negative'),
  
  body('category').isIn(['electronics', 'clothing', 'books', 'home', 'sports', 'toys', 'beauty', 'other'])
    .withMessage('Please select a valid category'),
  
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  
  handleValidationErrors
];

const validateAddress = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('mobile').matches(/^[6-9]\d{9}$/).withMessage('Please provide a valid 10-digit mobile number'),
  body('address').trim().notEmpty().withMessage('Address is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').matches(/^\d{6}$/).withMessage('Please provide a valid 6-digit pincode'),
  
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateAddress,
  handleValidationErrors
};