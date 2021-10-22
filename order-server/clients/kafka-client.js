const { Kafka } = require("kafkajs");

class KafkaBroker {
  constructor() {
    this.producer = undefined;
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
        this.producer = producer;
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
    }
    return this.producer;
  }
}
new KafkaBroker();

module.exports = KafkaBroker;
