import { RowDataPacket } from "mysql2/promise";

import { connection } from "../../src/model/database";
import { calculateHash } from "./calculateHash";

export async function verifyBlockchain() {
    const connect = await connection.pool.getConnection();
    try {
        // Получаем все транзакции в порядке их создания
        const [transactions]: any[] = await connect.query(
            "SELECT id, wallet_id, currency_sell, currency_buy, value_sell, value_buy, prev_hash, hash FROM transactions ORDER BY id ASC"
        );

        let previousHash: string | null = null;

        for (const tx of transactions) {
            // Генерируем новый хэш заново из данных транзакции
            const recalculatedHash = calculateHash(
                tx.wallet_id,
                tx.currency_sell,
                tx.currency_buy,
                parseFloat(tx.value_sell),
                parseFloat(tx.value_buy),
                tx.prev_hash || null,
            );

            // Проверяем, совпадает ли пересчитанный хэш с тем, что в БД
            if (recalculatedHash !== tx.hash) {
                console.error(`❌ Ошибка: Хэш не совпадает в транзакции ID ${tx.id}`);
                return false;
            }

            // Проверяем, что prev_hash совпадает с hash предыдущей транзакции
            if (tx.prev_hash !== previousHash) {
                console.error(`❌ Ошибка: Нарушена цепочка блоков на ID ${tx.id}`);
                return false;
            }

            // Обновляем предыдущий хэш для следующей итерации
            previousHash = tx.hash;
        }
        console.log("✅ Блокчейн целостен, хэши совпадают!");
        return true;
    } catch (error) {
        console.error("❌ Ошибка при проверке блокчейна:", error);
        return false;
    } finally {
        connect.release();
    }
}
