import { RowDataPacket } from "mysql2/promise";

import { connection } from "./database";

export class TelegramTokenModel {
    private static tableName = "telegram_tokens";

    static async create(userId: number, token: string, expiredAt: Date): Promise<any> {
        try {
            await connection.query(
                `INSERT INTO ${this.tableName} (user_id, token, expired_at, is_active) VALUES (?, ?, ?, ?)`, 
                [userId, token, expiredAt, 1]
            );
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
            await connection.query(`UPDATE ${this.tableName} SET is_active = 0 WHERE id = ?`, [tokenId]);
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
                const [tokenRecord]: [RowDataPacket[], any] = await connection.query(
                    `SELECT * FROM ${this.tableName} WHERE token = ?`, 
                    [token]
                );
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
