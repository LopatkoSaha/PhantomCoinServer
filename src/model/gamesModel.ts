import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";

export class GamesModel {

  static async getGameInfo (nameGame: string): Promise<any> {
      try {
        const [gameInfo]: [RowDataPacket[], any] = await connection.query(
          "SELECT * FROM games WHERE name = ?",  
          [nameGame]
        );
          return gameInfo;
      } catch (error) {
        if (error) {
          throw new Error(`Failed to geted games session forecast: ${error}`);
        }
      }
    }

  static async createGame (nameGame: string, discription: string): Promise<any>  {
    try {
        await connection.query(
            `INSERT INTO games (name, discription) VALUES (?, ?)`, 
            [nameGame, discription]
        );
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to created game info: ${error.message}`);
        } else {
            throw new Error("An unknown error occurred");
        }
    }
  }

  static async setGameInfo (id: number, nameGame: string, discription: string): Promise<any>  {
      try {
          await connection.query(`UPDATE games SET name = ?, discription = ? WHERE id = ?`,
              [nameGame, discription, id]);
      } catch (error) {
          if (error) {
          throw new Error(`Failed to updated game info: ${error}`);
          }
      }
  }

}