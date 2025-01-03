"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModel = void 0;
const usersModel_1 = require("./usersModel");
class AuthModel {
    static async registrationUser(data) {
        const { name, email, password } = data;
        usersModel_1.UserModel.createUser(data);
    }
}
exports.AuthModel = AuthModel;
