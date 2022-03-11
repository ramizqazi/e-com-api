const express = require('express');
const { body } = require('express-validator');

const authController = require('./controller.auth');
const validate = require('../util/validate.util');

const router = express.Router();

router.post(
  '/register',
  validate([
    body('email', 'Invalid parameter "email"')
      .trim()
      .isEmail(),
    body('password', 'Password must be at least 8 characters long and contains at least one number and one letter')
      .isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      }),
    body('firstName', 'Invalid parameter "firstName"')
      .trim()
      .notEmpty(),
    body('lastName', 'Invalid parameter "lastName"')
      .trim()
      .notEmpty(),
    body('phone', 'Invalid parameter "lastName"')
      .isNumeric()
      .notEmpty(),
  ]),
  authController.register,
);

router.post(
  '/login',
  validate([
    body('email', 'Invalid parameter "email"')
      .trim()
      .notEmpty(),
    body('password', 'Password must be at least 8 characters long and contains at least one number and one letter')
      .isStrongPassword({
        minLength: 8,
        minNumbers: 1,
        minSymbols: 0,
        minLowercase: 0,
        minUppercase: 0,
      }),
  ]),
  authController.login,
);

module.exports = router;
