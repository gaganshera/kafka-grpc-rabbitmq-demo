const RabbitMqBroker = require("./clients/rabbitmq-broker-client");

async function consumer() {
  const broker = await RabbitMqBroker.getBroker();

  try {
    const subscription = await broker.subscribe("notifications_s1");
    subscription
      .on("message", (message, content, ackOrNack) => {
        console.log(content);
        ackOrNack();
      })
      .on("error", (err) => {
        console.error("Subscriber error", err);
      })
      .on("invalid_content", (err, message, ackOrNack) => {
        console.error("Invalid content", err);
        ackOrNack(err);
      });
  } catch (err) {
    // subscription didn't exist
    console.error("Subscription error", err);
  }
}

consumer();
