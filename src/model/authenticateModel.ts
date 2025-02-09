import { UserModel, TData } from "./usersModel";

export class AuthModel {

  static async registrationUser(data: TData): Promise<void> {
    const { name, email, password } = data;
    UserModel.createUser(data);
  }
}
