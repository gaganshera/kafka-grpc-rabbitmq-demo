const Broker = require("rascal").BrokerAsPromised;
const brokerConfig = require("../config/broker-config.json");

class RabbitMqBroker {
  constructor() {
    this.broker = undefined;
    brokerConfig.vhosts["v1"].connection.url = process.env.RABBIT_MQ_URI;
  }

  static async getBroker() {
    if (!this.broker) {
      this.broker = await Broker.create(brokerConfig);
      this.broker.on("error", (err, { vhost, connectionUrl }) => {
        console.error("Broker error", err, vhost, connectionUrl);
      });
      this.broker.on("blocked", (reason, { vhost, connectionUrl }) => {
        console.log(
          `Vhost: ${vhost} was blocked using connection: ${connectionUrl}. Reason: ${reason}`
        );
      });
      this.broker.on("unblocked", ({ vhost, connectionUrl }) => {
        console.log(`Vhost: ${vhost} was unblocked using connection: ${connectionUrl}.`);
      });
    }
    return this.broker;
  }
}
new RabbitMqBroker();

module.exports = RabbitMqBroker;
