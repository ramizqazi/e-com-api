const mongoose = require('mongoose');
const {
  Dish,
  Vote,
  Order,
} = require('../models');

/**
 * Update rank of dish in leaderboard
 */
exports.updateRank = async (id, session) => {
  // Last 24hrs filter by _id
  const last24HrsFilter = {
    $gt: mongoose.Types.ObjectId.createFromTime(Date.now() / 1000 - 24 * 60 * 60),
  };

  // Get orders of last 24hrs
  const orders = await Order.find(
    {
      pos: false,
      _id: last24HrsFilter,
    },
  ).session(session);
  const completedOrders = orders.filter((order) => order.status === 'completed');
  const totalOderCount = completedOrders.length;
  const dishOrderCount = completedOrders
    .filter((order) => order.items.find((item) => item.dish.toString() === id.toString())).length;
  const ordersRatio = dishOrderCount / (totalOderCount || 1);

  // Get dish's votes of last 24hrs
  const votes = await Vote.find(
    {
      dishes: id,
      _id: last24HrsFilter,
    },
  ).session(session);
  const upVotes = votes.filter((vote) => vote.type === 'up').length;
  const downVotes = votes.filter((vote) => vote.type === 'down').length;
  const votesRatio = upVotes / (downVotes || 1);

  // Update dish rank
  const updatedRank = 0.5 * ordersRatio + 0.15 * votesRatio;
  await Dish.findByIdAndUpdate(id, { rank: updatedRank }).session(session);
};
