/**
 * Get dish discount
 */
exports.getDishDiscount = (dish, variant) => {
  let discount = 0;
  const today = new Date();
  const start = new Date(dish?.discount?.startAt);
  const end = new Date(dish?.discount?.endAt);

  if (start < today && end > today) {
    if (dish?.discount?.type === 'percentage') {
      const price = variant?.price || (dish?.variants && dish?.variants[0]?.price) || dish?.price;
      discount = (price * dish.discount.value) / 100;
    }
    if (dish?.discount?.type === 'amount') {
      discount = dish.discount.value;
    }
  }

  return (discount || 0);
};
