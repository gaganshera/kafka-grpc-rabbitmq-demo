const { v4: uuidv4 } = require("uuid");
const RabbitMqBroker = require("../clients/rabbitmq-broker-client");

async function placeOrder(call, callback) {
  const { product_id, quantity } = call.request;
  console.log(`Mock order placed for product id ${product_id} for quantity ${quantity}`);

  const order = { orderId: uuidv4(), message: "success", status: 1 };

  console.log("Publish post order events to RabbitMQ");
  try {
    const broker = await RabbitMqBroker.getBroker();
    broker.publish("notifications_p1", order);
  } catch (err) {
    console.log("Error publishing to broker", err);
  }

  callback(null, order);
}

module.exports = {
  placeOrder: placeOrder,
};
