import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";
import { configWallet } from "../../config/config";

type TWallet = typeof configWallet;

export class WalletModel {
  static async getWallet(userId: number): Promise<any> {
    try {
      const walletSql =
        "SELECT * FROM wallets WHERE id IN (SELECT users.walletId FROM users WHERE id = ?)";
      const [rows]: [RowDataPacket[], any] = await connection.query(walletSql, [
        userId,
      ]);
      const wallet = rows;
      return wallet;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to geted wallet: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
  static async updateWallet(userId: number, coins: TWallet): Promise<void> {
    let coinNames: Array<string> = [];
    let coinValues: Array<number> = [];
    Object.entries(coins).forEach(([name, value]) => {
      coinNames.push(`${name} = ?`);
      coinValues.push(value);
    });
    const walletSql = `UPDATE wallets SET ${coinNames.join()} WHERE id = ${userId}`;
    try {
      await connection.query(walletSql, coinValues);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to updated wallet: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
  static async creatWallet(): Promise<void> {}

  static async deleteWallet(id: number): Promise<void> {
    try {
      const userSql = "DELETE FROM users WHERE id=?";
      const walletSql = "DELETE FROM wallets WHERE id=?";
      await connection.query(userSql, [id]);
      await connection.query(walletSql, [id]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}
