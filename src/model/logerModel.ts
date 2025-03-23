import { kafkaProducer } from "../kafkaProducer";


export class loger {

    static async info (message: any) {
        kafkaProducer.send("info", message);
    }

    static async warning (message: any) {
        kafkaProducer.send("warning", message);
    }

    static async error (message: any) {
        kafkaProducer.send("error", message);
    }
}