import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";
import { configWallet } from "../../config/config";

export class WalletModel {

  static async getWallet(userId: number): Promise<any> {
    try {
      const [wallet]: [RowDataPacket[], any] = await connection.query(
        "SELECT * FROM wallets WHERE id IN (SELECT users.walletId FROM users WHERE id = ?)", 
        [userId]
      );
      return wallet;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to geted wallet: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async getAllWalletsInfo(): Promise<any> {
    try {
      const wallets: RowDataPacket[] = await connection.query(
        `SELECT 
          u.id AS userId,
          u.name,
          u.email,
          u.created_at,
          w.* 
        FROM users u 
        LEFT JOIN wallets w ON u.id = w.id
      `);
      if(wallets.length === 0) {
        return null;
      }
      return wallets;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to geted wallet: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
  
  static async updateWallet(userId: number, coins: Record<string, number>): Promise<void> {
    let coinNames: Array<string> = [];
    let coinValues: Array<number> = [];

    Object.entries(coins).forEach(([name, value]) => {
      if(Object.keys(configWallet).includes(name)){
        coinNames.push(`${name} = ?`);
        coinValues.push(value);
      }
    });
    try {
      const query = `UPDATE wallets SET ${coinNames.join(", ")} WHERE id = ${userId}`;
      await connection.query(query, coinValues);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to updated wallet: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}
