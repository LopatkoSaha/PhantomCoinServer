import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";
import {WalletModel } from "./walletModel";

export class TokenForecact {

  static async get (userId: number): Promise<any> {
      try {
        const [tokensForecast]: [RowDataPacket[], any] = await connection.query(
          "SELECT token_forecast FROM aditional_info WHERE user_id = ?", 
          [userId]
        );
          return Object.values(tokensForecast)[0];
      } catch (error) {
        if (error) {
          throw new Error(`Failed to geted user token forecast: ${error}`);
        }
      }
    }

  static async set (userId: number, value: number, coinName = "usd" ): Promise<any>  {
      try {
          await connection.query(`UPDATE aditional_info SET token_forecast = ? WHERE user_id = ${userId}`, [value]);
          return;
        } catch (error) {
          if (error) {
            throw new Error(`Failed to buy token forecast: ${error}`);
          }
      }
  }
}