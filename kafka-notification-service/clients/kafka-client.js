const { Kafka } = require("kafkajs");

class KafkaBroker {
  constructor() {
    this.producer = undefined;
    this.consumer = undefined;
  }

  static async getProducer() {
    if (!this.producer) {
      try {
        const kafka = new Kafka({
          clientId: "order-service",
          brokers: JSON.parse(process.env.KAFKA_CLUSTERS),
        });
        const producer = kafka.producer();
        await producer.connect();
      } catch (err) {
        console.log("Error in connecting to Kafka", err);
        throw err;
      }

      const errorTypes = ["unhandledRejection", "uncaughtException"];
      const signalTraps = ["SIGTERM", "SIGINT", "SIGUSR2"];

      errorTypes.map((type) => {
        process.on(type, async () => {
          try {
            console.log(`process.on ${type}`);
            await producer.disconnect();
            process.exit(0);
          } catch (_) {
            process.exit(1);
          }
        });
      });

      signalTraps.map((type) => {
        process.once(type, async () => {
          try {
            await producer.disconnect();
          } finally {
            process.kill(process.pid, type);
          }
        });
      });

      this.producer = producer;
    }
    return this.producer;
  }

  static async getConsumer() {
    if (!this.consumer) {
      try {
        const kafka = new Kafka({
          clientId: "order-service-consumer",
          brokers: JSON.parse(process.env.KAFKA_CLUSTERS),
        });
        const consumer = kafka.consumer({ groupId: "order-consumer-group" });
        await consumer.connect();
        this.consumer = consumer;
      } catch (err) {
        console.log("Error in connecting to Kafka", err);
        throw err;
      }
    }
    return this.consumer;
  }
}
new KafkaBroker();

module.exports = KafkaBroker;
