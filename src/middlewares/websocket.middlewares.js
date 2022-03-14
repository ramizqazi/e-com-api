const { User } = require('../modals');
const { JWT_SECRET } = require('../config/secrets.config');
const { verifyToken } = require('../util/jwt');

exports.requireCustomerAuth = async (socket, next) => {
  try {
    const payload = await verifyToken(socket.handshake.auth?.token, JWT_SECRET);
    const user = await User.findById(payload.sub)
      .populate('role');

    if (!user || user.disabled) {
      throw new Error('Unauthorized');
    }

    // eslint-disable-next-line no-param-reassign
    socket.handshake.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

exports.requireMerchantAuth = async (socket, next) => {
  try {
    const payload = await verifyToken(socket.handshake.auth?.token, JWT_SECRET);
    const user = await User.findById(payload.sub)
      .populate('role')
      .populate('restaurant');

    if (!user || user.disabled || user.role?.app !== 'merchant') {
      throw new Error('Unauthorized');
    }

    // eslint-disable-next-line no-param-reassign
    socket.handshake.user = user;
    next();
  } catch (e) {
    next(e);
  }
};

exports.requireRiderAuth = async (socket, next) => {
  try {
    const payload = await verifyToken(socket.handshake.auth?.token, JWT_SECRET);
    const user = await User.findById(payload.sub)
      .populate('role')
      .populate('restaurant');

    if (!user || user.disabled || user.role?.app !== 'rider') {
      throw new Error('Unauthorized');
    }

    // eslint-disable-next-line no-param-reassign
    socket.handshake.user = user;
    next();
  } catch (e) {
    next(e);
  }
};
