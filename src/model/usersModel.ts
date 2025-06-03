import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcrypt";

import { connection } from "./database";
import { configWallet } from "../../config/config";

export type TData = {
  name: string;
  email: string;
  password: string;
  telegram_id?: string | null;
};

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  walletId: string | null;
  telegram_id: string | null;
  permission: {
    users: number | null;
    wallets: number | null;
    games: number | null;
  };
}

export interface Admin extends Omit<User, "email" | "password" | "created_at" | "walletId" | "telegram_id"> {
  permission: {
    users: number;
    wallets: number;
    games: number;
  };
}

export class UserModel {
  static async createUser(data: TData): Promise<void> {
    const { name, email, password } = data;
    const hash = bcrypt.hashSync(password, 8);
    const walletSql = `INSERT INTO wallets (
      ${Object.keys(configWallet)
      .join()}) VALUES (${Object.values(configWallet).join()}
    )`;
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
    try {
      await connection.query(
        "INSERT INTO users (name, email, password, walletId, telegram_id, is_active) VALUES (?, ?, ?, ?, ?, 1)", 
        [name, email, hash, walletId, null]
      );
      await connection.query(
        "INSERT INTO aditional_info (user_id, token_forecast) VALUES (?, ?)", 
        [walletId, 5]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async getAdmin(id: number): Promise<Admin | null> {
    const [user]: RowDataPacket[] = await connection.query(`
      SELECT u.id, u.name, u.email, u.password, u.created_at, u.walletId, u.telegram_id, a.users, a.wallets, a.games
      FROM users u 
      LEFT JOIN admin a ON u.id = a.user_id
      WHERE u.id=?
    `, [id]); 
    if (!user) {
      console.log(`User with id ${id} not found`);
      return null;
    }
    const admin: Admin = {
      id: user.id,
      name: user.name,
      permission: {
        users: user.users,
        wallets: user.wallets,
        games: user.games
      },
    };
    return admin;
  }

  static async getUser(id: number): Promise<User | null> {
    const [row]: RowDataPacket[] = await connection.query(`
      SELECT u.id, u.name, u.email, u.password, u.created_at, u.walletId, u.telegram_id, a.users, a.wallets, a.games
      FROM users u 
      LEFT JOIN admin a ON u.id = a.user_id
      WHERE u.id=?
    `, [id]); 
    if (!row) {
      console.log(`User with id ${id} not found`);
      return null;
    }
    const user = {
      id: row.id,
      name: row.name,
      email: row.email,
      password: row.password,
      created_at: row.created_at,
      walletId: row.walletId,
      telegram_id: row.telegram_id,
      permission: {
        users: row.users,
        wallets: row.wallets,
        games: row.games,
      },
    };
    return user;
  }

  static async getAllUsers(): Promise<RowDataPacket[] | null> {
    const allUsers: RowDataPacket[] = await connection.query("SELECT id, name, is_active, email, created_at, walletId, telegram_id FROM users"); 
    if (allUsers.length === 0) {
      console.log(`Users not found`);
      return null;
    }
    return allUsers;
  }

  static async getUserByTelegramId(telegramId: number): Promise<RowDataPacket | null> {
    const [user]: RowDataPacket[] = await connection.query("SELECT * FROM users WHERE telegram_id = ?", [telegramId]); 
    if (!user) {
      console.log(`User with telergram id ${telegramId} not found`);
      return null;
    }
    return user;
  }

  static async existUser(email: string): Promise<boolean> {
    const [user]: RowDataPacket[] = await connection.query("SELECT * FROM users WHERE email=?", [email]);
    return !user ? true : false;
  }


  static async updateUser(id: number, data: TData): Promise<void> {
    const { name, email, password, telegram_id } = data;
    const hash = bcrypt.hashSync(password, 8);
    try {
      await connection.query(
        "UPDATE users SET name = ?, email = ?, password = ?, telegram_id = ? WHERE id = ?", 
        [name, email, hash, telegram_id ? telegram_id : null, id]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async updateTelegramId(userId: number, telegramId: string): Promise<void> {
    try {
      await connection.query(
        "UPDATE users SET telegram_id = ? WHERE id = ?", 
        [telegramId, userId]
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update telegram id: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async activationUser (userId: number): Promise<void> {
    try {
      await connection.query(
        "UPDATE users SET is_active = ? WHERE id=?", [1, userId]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update to activation user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async deactivationUser (userId: number): Promise<void> {
    try {
      await connection.query(
        "UPDATE users SET is_active = ? WHERE id=?", [0, userId]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update to activation user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  static async deleteUser(id: number): Promise<void> {
    try {
      await connection.query("DELETE FROM users WHERE id=?", [id]);
      await connection.query("DELETE FROM wallets WHERE id=?", [id]);
      await connection.query("DELETE FROM aditional_info WHERE id=?", [id]);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete user: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }
}
