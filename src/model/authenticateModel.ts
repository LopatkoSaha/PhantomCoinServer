import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "./database";
import { UserModel, TData } from "./usersModel";

export class AuthModel {

  static async registrationUser(data: TData): Promise<void> {
    const { name, email, password } = data;
    UserModel.createUser(data);
  }
}
