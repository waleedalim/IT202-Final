let orders = [];
let orderIdCounter = 1;

function addOrder(orderDetails) {
  const newOrder = {
    orderId: orderIdCounter++,
    ...orderDetails
  };
  orders.push(newOrder);
  return newOrder;
}

module.exports = { orders, addOrder };