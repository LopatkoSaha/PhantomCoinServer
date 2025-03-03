import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";

export class TelegramTokenModel {
    private static tableName = "telegram_tokens";

    static async create(userId: number, token: string, expiredAt: Date): Promise<any> {
        try {
            const TelegramTokenSql =
                `INSERT INTO ${this.tableName} (user_id, token, expired_at, is_active) VALUES (?, ?, ?, ?)`;
            await connection.query(TelegramTokenSql, [userId, token, expiredAt, 1]);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create telegram token: ${error.message}`);
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    }

    static async deactivate(tokenId: number): Promise<any> {
        try {
            const TelegramTokenSql =
                `UPDATE ${this.tableName} SET is_active = 0 WHERE id = ?`;
            await connection.query(TelegramTokenSql, [tokenId]);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to deactivate telegram token: ${error.message}`);
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    }

    static async findByToken(token: string): Promise<any> {
        try {
            const TelegramTokenSql =
                `SELECT * FROM ${this.tableName} WHERE token = ?`;
                const [tokenRecord]: [RowDataPacket[], any] = await connection.query(TelegramTokenSql, [
                    token
                  ]);

                  return tokenRecord;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fined telegram token: ${error.message}`);
            } else {
                throw new Error("An unknown error occurred");
            }
        }
    }

}
