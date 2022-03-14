const { Server } = require('socket.io');

const {
  requireRiderAuth,
  requireCustomerAuth,
  requireMerchantAuth,
} = require('../middlewares/websocket.middlewares');

/**
 * Socket io server
 */
exports.io = new Server();

/**
 * Customer orders socket
 */
exports.customerOrdersIO = this.io.of('/customer/orders')
  .use(requireCustomerAuth)
  .use(async (socket, next) => {
    try {
      const { user } = socket.handshake;
      const { id } = socket.handshake.query;

      const order = await Order.findById(id);

      if (!order || `${order.customer}` !== `${user._id}`) {
        throw new Error('Unauthorized');
      }

      // eslint-disable-next-line no-param-reassign
      socket.handshake.order = order;
      next();
    } catch (e) {
      next(e);
    }
  })
  .on('connection', (socket) => {
    const { order } = socket.handshake;

    /**
     * A separate room for each order
     */
    socket.join(`${order._id}`);
  });

/**
 * Merchant orders socket
 */
exports.merchantOrdersIO = this.io.of('/merchant/orders')
  .use(requireMerchantAuth)
  .on('connection', (socket) => {
    const { user } = socket.handshake;

    /**
     * A separate room for each restaurant
     */
    socket.join(`${user?.restaurant?._id}`);
  });

/**
 * Rider orders socket
 */
exports.riderOrdersIO = this.io.of('/rider/orders')
  .use(requireRiderAuth)
  .on('connection', (socket) => {
    const { user } = socket.handshake;

    /**
     * A separate room for each restaurant
     */
    socket.join(`${user?._id}`);
  });
