require("dotenv").config();
const KafkaBroker = require("./clients/kafka-client");

async function consumer() {
  try {
    const consumer = await KafkaBroker.getConsumer();
    await consumer.subscribe({ topic: "notification-kt-1" /*, fromBeginning: true*/ });
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}#${message.value}`);
      },
    });
  } catch (err) {
    // Consumer error
    console.error("Consumer error", err);
  }
}

consumer();
