import { RowDataPacket } from "mysql2/promise";

import { connection } from "./database";

export class AdminModel {

  static async getAdminPermissions(userId: number){
    const [adminPermissions]: RowDataPacket[] = await connection.query("SELECT users, wallets, games FROM admin WHERE user_id=? AND is_active = 1", [userId]); 
    if (!adminPermissions) {
      console.log(`For user with id ${userId} permissions not found`);
      return null;
    }
    return adminPermissions;
  }
}