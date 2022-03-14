const express = require('express');

const productsController = require('./controller.products');
const { requireCustomerAuth } = require('../config/passport.config');

const router = express.Router();
router.use(requireCustomerAuth);

router.get('/', productsController.getProducts);

router.get(
  '/:id',
  productsController.getProduct,
);

module.exports = router;
