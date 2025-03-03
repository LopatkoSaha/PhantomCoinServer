import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";
import { configWallet } from "../../config/config";

type TPreorder = {
  wallet_id: number;
  currency_sell: string;
  currency_buy: string;
  value_buy: number;
  is_all_in: 0 | 1;
  trigger_course: number;
  is_active: 0 | 1;
  status: "pending" | "success" | "fail";
};

type TGetPreordersWallet = Pick<TPreorder, "wallet_id">;

export class PreordersModel {
  static async getPreordersWallet(walletId: TGetPreordersWallet): Promise<[RowDataPacket[], any]> {
    try {
        const preordersSql =
            "SELECT * FROM preorder WHERE wallet_id = ? ORDER BY is_active DESC, created_at DESC";
        const preorders: [RowDataPacket[], any] = await connection.query(preordersSql, [
          walletId,
        ]);

      return preorders;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to geted preorders: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async setPreorder( conditions: Record<string, number | string>): Promise<string> {
    try {
      await connection.query(
        `INSERT INTO preorder (wallet_id, currency_sell, currency_buy, value_buy, is_all_in, trigger_course, is_active, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [conditions.wallet_id, conditions.currency_sell, conditions.currency_buy, conditions.value_buy, conditions.is_all_in, conditions.trigger_course, conditions.is_active, conditions.status]
      );
      return `New preorder for wallet with id ${conditions.wallet_id} is created`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to set preorder: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async updatePreorder(preorderId: number, conditions: Record<string, number | string>): Promise<void> {
    const updatePreorderSql = `UPDATE preorder SET is_active = ?, status = ?, triggered_at = ? WHERE id = ${preorderId}`;
    try {
      await connection.query(updatePreorderSql, [conditions.is_active, conditions.status, conditions.triggered_at]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to updated preorder id = ${preorderId}: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async deletePreorder (preorderId: number, walletId: number): Promise<string> {
    try {
      const userSql = "DELETE FROM preorder WHERE id=?";
      await connection.query(userSql, [preorderId]);
      return `preorder for wallet with id ${walletId} is deleted`
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete preorder: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async getProcessPreorders (nameChangedCoin: string, lastCourse: Record<string, any>) {
    try {
      lastCourse.usd = 1;
      const preordersToProcessSql =`
            SELECT 
                u.name AS userName,
                u.id AS userId,
                u.telegram_id AS telegramId,
                p.id AS preorderId,
                p.wallet_id AS walletId,
                p.currency_sell AS currencySell,
                p.currency_buy AS currencyBuy,
                p.value_buy AS valueBuy,
                p.is_all_in AS isAllIn,
                p.trigger_course AS triggerCourse,
                p.created_at AS createdAt,
                w.*
            FROM preorder p 
            LEFT JOIN wallets w ON p.wallet_id = w.id 
            LEFT JOIN users u ON w.id = u.walletId 
            WHERE p.currency_buy = ? 
            AND p.is_active = 1
            AND p.trigger_course >= ?
            `;
        const preordersToProcess: [RowDataPacket[], any] = await connection.query(preordersToProcessSql, [
            nameChangedCoin, lastCourse[nameChangedCoin]
        ]);
      return preordersToProcess
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to geted preorders process: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}
