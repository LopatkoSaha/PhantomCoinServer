import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcrypt";

import { connection } from "./database";
import { configWallet } from "../../config/config";

export type TData = {
  name: string;
  email: string;
  password: string;
};

export interface User extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  hashPassword: string;
  created_at: Date;
  walletId: string | null;
}

export class UserModel {
  static async createUser(data: TData): Promise<void> {
    const { name, email, password } = data;
    const hash = bcrypt.hashSync(password, 8);
    const walletSql = `INSERT INTO wallets (${Object.keys(
      configWallet
    ).join()}) VALUES (${Object.values(configWallet).join()})`;
    let walletId: number;
    try {
      const result = await connection.query<ResultSetHeader>(walletSql);
      
      if (!result.insertId) {
        throw new Error("Failed to retrieve wallet ID after creation");
      } else {
        walletId = result.insertId;
      }
    } catch (error) {
      throw new Error(
        `Failed to create wallet: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
    const userSql =
      "INSERT INTO users (name, email, password, walletId) VALUES (?, ?, ?, ?)";
    try {
      await connection.query(userSql, [name, email, hash, walletId]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async getUser(id: number): Promise<User | null> {
    const sql = "SELECT * FROM users WHERE id=?";
    const [user] = await connection.query<User[]>(sql, [id]); 

    if (!user.id) {
      console.log(`User with id ${id} not found`);
      return null;
    }
    return user;
  }

  static async existUser(email: string): Promise<boolean> {
    const sql = "SELECT * FROM users WHERE email=?";
    const [user] = await connection.query<User[]>(sql, [email]);
    return !user ? true : false;
  }

  static async updateUser(id: number, data: TData): Promise<void> {
    const { name, email, password } = data;
    const hash = bcrypt.hashSync(password, 8);
    const sql =
      "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
    try {
      await connection.query(sql, [name, email, hash, id]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async deleteUser(id: number): Promise<void> {
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
