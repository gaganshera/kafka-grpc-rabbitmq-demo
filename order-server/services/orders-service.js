const { v4: uuidv4 } = require('uuid');

function placeOrder(call, callback) {
  const { product_id, quantity } = call.request;
  console.log(`Mock order placed for product id ${product_id} for quantity ${quantity}`);

  const order = { orderId: uuidv4(), message: "success", status: 1};
  console.log("Publish post order events")

  callback(null, order);
}

module.exports = {
  placeOrder: placeOrder
}