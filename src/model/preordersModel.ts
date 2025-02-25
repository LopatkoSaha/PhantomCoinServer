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
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}
