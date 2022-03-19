const express = require('express');
const { query } = require('express-validator');

const productsController = require('./controller.products');
const validate = require('../util/validate.util');

const router = express.Router();

router.get('/', productsController.getProducts);

router.get(
  '/:id',
  productsController.getProduct,
);

router.get(
  '/find',
  validate([
    query('q', 'Invalid parameter "q"').isString().notEmpty(),
    query('limit', 'Invalid parameter "limit"').isNumeric().optional(),
  ]),
  productsController.findProduct,
);

module.exports = router;
