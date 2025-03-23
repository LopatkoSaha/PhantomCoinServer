import { Kafka } from "kafkajs";

import { kafkaServerAdres } from "../config/config";

class KafkaProducer {
    private producer;

    constructor () {
      const kafka = new Kafka({
          clientId: 'phantom-coin',
          brokers: [kafkaServerAdres],
      });
      this.producer = kafka.producer();
    }

    async startProducer () {
      await this.producer.connect();
      console.log('✅ Kafka подключена');
    };

    async send (type: string, data: any) {
      await this.producer.send({
        topic: 'loger',
        messages: [
          {value: JSON.stringify({type, data})},
        ],
      });
      console.log('✅ Сообщение в kafka отправлено');
    };
}
export const kafkaProducer = new KafkaProducer();