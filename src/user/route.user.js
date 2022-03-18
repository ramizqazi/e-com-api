const express = require('express');
const { query } = require('express-validator');

const usersController = require('./controller.user');
const validate = require('../util/validate.util');
const { requireCustomerAuth } = require('../config/passport.config');

const router = express.Router();
router.use(requireCustomerAuth);

router.post(
  '/:id/add_wishList',
  validate([
    query('user', 'Invalid parameter "user"')
      .optional()
      .isString(),
  ]),
  usersController.addWishList,
);

router.post(
  '/:id/remove_wishList',
  validate([
    query('user', 'Invalid parameter "user"')
      .optional()
      .isString(),
  ]),
  usersController.removeWishList,
);
module.exports = router;
