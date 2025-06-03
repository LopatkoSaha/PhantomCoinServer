import { UserModel, TData } from "./usersModel";

export class AuthModel {

  static async registrationUser(data: TData): Promise<void> {
    UserModel.createUser(data);
  }
}
