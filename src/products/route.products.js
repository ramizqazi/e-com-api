const express = require('express');

const productsController = require('./controller.products');

const router = express.Router();

router.get('/', productsController.getProducts);

router.get(
  '/:id',
  productsController.getProduct,
);

module.exports = router;
