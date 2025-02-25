import { RowDataPacket } from "mysql2/promise";

import { connection } from "../../src/model/database";
import { calculateHash } from "../helpers/calculateHash";


export class Trasaction {
    static async addTransaction(
        wallet_id: number,
        currency_sell: string,
        currency_buy: string,
        value_sell: number,
        value_buy: number,
    ) {
        const connect = await connection.pool.getConnection();
        try {
            await connect.beginTransaction();

            // Получаем последний хэш
            const [lastTx]: any[] = await connection.query("SELECT hash FROM transactions ORDER BY id DESC LIMIT 1");
            const prevHash = lastTx ? lastTx.hash : null;

            // Генерируем новый хэш
            const newHash = calculateHash(
                wallet_id,
                currency_sell,
                currency_buy,
                value_sell,
                value_buy,
                prevHash);

            // Записываем транзакцию
            await connection.query(
                `INSERT INTO transactions (wallet_id, currency_sell, currency_buy, value_sell, value_buy, prev_hash, hash) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [wallet_id, currency_sell, currency_buy, value_sell, value_buy, prevHash, newHash]
            );

            await connect.commit();
            console.log("✅ Транзакция добавлена:", newHash);
        } catch (error) {
            await connect.rollback();
            console.error("❌ Ошибка транзакции:", error);
        } finally {
            connect.release();
        }
    }
}

