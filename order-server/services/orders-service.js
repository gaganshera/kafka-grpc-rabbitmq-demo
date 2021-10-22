const { v4: uuidv4 } = require("uuid");
const RabbitMqBroker = require("../clients/rabbitmq-broker-client");
const KafkaBroker = require("../clients/kafka-client");

async function placeOrder(call, callback) {
  const { product_id, quantity } = call.request;
  console.log(`Mock order placed for product id ${product_id} for quantity ${quantity}`);

  const order = { orderId: uuidv4(), message: "success", status: 1 };

  try {
    //Rabbit mq publish
    const broker = await RabbitMqBroker.getBroker();
    broker.publish("notifications_p1", order);
    console.log("Published post order events to RabbitMQ");
  } catch (err) {
    console.log("Error publishing to rabbitmq broker", err);
  }

  try {
    //kafka publish
    const kafkaProducer = await KafkaBroker.getProducer();
    await kafkaProducer.send({
      topic: "notification-kt1",
      messages: [{ key: order.orderId, value: JSON.stringify(order) }],
    });
    console.log("Published post order events to Kafka");
  } catch (err) {
    console.log("Error publishing to kafka producer", err);
  }

  callback(null, order);
}

module.exports = {
  placeOrder: placeOrder,
};
