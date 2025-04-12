import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";

export class GamesOptionsModel {

  static async getAllGameOptions (gameId: number): Promise<any> {
      try {
        const allGameInfo: [RowDataPacket[], any] = await connection.query(
          "SELECT * FROM games_options WHERE game_id = ?", 
          [gameId] 
        );
          return allGameInfo;
      } catch (error) {
        if (error) {
          throw new Error(`Failed to geted games options: ${error}`);
        }
      }
    }

    static async getOneGameOptions (gameId: number, nameComplexity: string): Promise<any> {
        try {
          const oneGameInfo: [RowDataPacket[], any] = await connection.query(
            "SELECT * FROM games_options WHERE game_id = ? AND name_complexity = ?",  
            [gameId, nameComplexity]
          );
          if (oneGameInfo[0].length === 0) {
            return null;
          }
            return oneGameInfo[0];
        } catch (error) {
          if (error) {
            throw new Error(`Failed to geted game options: ${error}`);
          }
        }
      }

  static async createGameOptions (gameId: number, nameComplexity: string, bonusCoefficient: number, discriptionComplexity: string, sortOrder: number, gameConfig: string): Promise<any>  {
    try {
        await connection.query(
            `INSERT INTO games_options (game_id, name_complexity, bonus_coefficient, discription_complexity, sort_order, game_config) VALUES (?, ?, ?, ?, ?, ?)`, 
            [gameId, nameComplexity, bonusCoefficient, discriptionComplexity, sortOrder, JSON.stringify(gameConfig)]
        );
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to created game info: ${error.message}`);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
  }

    static async setBonusCoefficient (id: number, bonusCoefficient: number): Promise<any>  {
        try {
            await connection.query(`UPDATE games_options SET bonus_coefficient = ? WHERE id = ?`,
                [bonusCoefficient, id]);
            return;
        } catch (error) {
            if (error) {
            throw new Error(`Failed to bonus coefficient: ${error}`);
            }
        }
    }

}