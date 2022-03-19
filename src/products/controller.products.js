const { Product, Store } = require('../modals');
const { paginate } = require('../util/pagination');

/**
 * GET /products
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { limit = 5, next_cursor, category } = req.query;
    const query = {};

    if (category === 'men') {
      query.category = 'men';
    }
    if (category === 'women') {
      query.category = 'women';
    }
    if (category === 'electronics') {
      query.category = 'electronics';
    }
    if (category === 'jewelry') {
      query.category = 'jewelry';
    }

    // Get products
    const response = await paginate(Product, limit, next_cursor, '_id', {
      query,
      transformCursorToEncode: (c) => c.getTime(),
      transformDecodedCursor: (c) => new Date(+c),
    });

    // Populate store
    await Product.populate(response.data, [
      {
        path: 'store',
        select: { name: 1 },
      },
    ]);
    response.data = response.data.map((product) => product.toJSON());
    res.status(200).json(response);
  } catch (e) {
    next(e);
    res.status(404).json({ message: e.message });
  }
};

/**
 * GET /customer/product/:id
 */
exports.getProduct = async (req, res, next) => {
  const { id } = req.params;

  // Get product
  Product.findById(id)
    .populate('store')
    .exec((err, product) => {
      if (err) {
        next();
      } else if (!product) {
        res.status(404).json({
          message: 'Product not found',
        });
      } else {
        const response = product.toJSON();
        res.status(200).json(response);
      }
    });
};

/**
 * GET /product/find
 */
exports.findProduct = async (req, res, next) => {
  try {
    const {
      q = '',
      limit = 10,
    } = req.query;

    const store = await Store.find({ name: { $regex: `.*${q}.*`, $options: 'i' } });

    let products;

    if (store[0]) {
      products = await Product.find({ store: store[0]?._id }).limit(Number(limit));
    } else {
      products = await Product.find({ name: { $regex: `.*${q}.*`, $options: 'i' } })
        .limit(Number(limit));
    }

    const response = {
      ok: true,
      data: products.map((item) => item.toJSON()),
      next_cursor: '',
    };
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
};
