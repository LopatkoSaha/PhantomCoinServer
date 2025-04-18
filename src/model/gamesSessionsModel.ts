import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";

export class GamesSessionsModel {

  static async findActiveSession (userId: number, gameId: number): Promise<any> {
      try {
        const gameSession: [RowDataPacket[], any] = await connection.query(
          "SELECT * FROM games_sessions WHERE user_id = ? AND game_id = ? AND status = 'active'",  
          [userId, gameId]
        );
        if (!gameSession[0]) {
            return null;
        }
        if (gameSession[0].length > 1) {
            throw new Error(`Expected 1 game session game id = ${gameId} with status "active" instead of ${gameSession[0].length}`);
        }
          return gameSession[0];
      } catch (error) {
        if (error) {
          throw new Error(`Failed to geted games session forecast: ${error}`);
        }
      }
    }

  static async creatActiveSession (gameId: number, userId: number, state: string, status: string, payoutValue: number | null, payoutCurrency: string | null, bidValue: number | null): Promise<any>  {
    try {
        await connection.query(
            `INSERT INTO games_sessions (game_id, user_id, state, status, payout_value, payout_currency, bid_value, update_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [gameId, userId, state, status, payoutValue, payoutCurrency, bidValue, new Date()]
        );
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to created games session: ${error.message}`);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
  }

    static async setGameData (id: number, state: string): Promise<any>  {
        try {
            await connection.query(`UPDATE games_sessions SET state = ?, update_at = ? WHERE id = ?`,
                [state, new Date(), id]);
            return;
        } catch (error) {
            if (error) {
            throw new Error(`Failed to updated game session: ${error}`);
            }
        }
    }

    static async finishGame (id: number, status: "win" | "loss" | "active"): Promise<any>  {
        try {
            await connection.query(`UPDATE games_sessions SET status = ?, update_at = ? WHERE id = ?`,
                [status, new Date(), id]);
            return;
        } catch (error) {
            if (error) {
            throw new Error(`Failed to updatad game session: ${error}`);
            }
        }
    }
}