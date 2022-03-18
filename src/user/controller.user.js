const { Product } = require('../modals');

/**
 * GET /user/:id/add_wishList
 */
exports.addWishList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;
    const { wishList } = user;

    // Get product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product Not Found' });
    }

    const existInWishList = await wishList?.find((w) => w === id);
    if (existInWishList) {
      return res.status(200).json({ message: 'Product Already Present In WishList' });
    }

    if (!existInWishList) {
      wishList.push(id);
    }
    await user.save();

    return res.status(200).json(user.toJSON());
  } catch (e) {
    return next(e);
  }
};

/**
 * GET /user/:id/remove_wishList
 */
exports.removeWishList = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { user } = req;

    // Get product
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Product Not Found' });
    }

    const filteredWishList = user.wishList.filter((w) => w !== id);

    user.wishList = filteredWishList;

    await user.save();

    res.status(200).json(user.toJSON());
  } catch (e) {
    next(e);
  }
};
