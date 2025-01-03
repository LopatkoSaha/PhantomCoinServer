"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("./database");
const config_1 = require("../../config/config");
class UserModel {
    static async createUser(data) {
        const { name, email, password } = data;
        const hash = bcrypt_1.default.hashSync(password, 8);
        const walletSql = `INSERT INTO wallets (${Object.keys(config_1.configWallet).join()}) VALUES (${Object.values(config_1.configWallet).join()})`;
        let walletId;
        try {
            const result = await database_1.connection.query(walletSql);
            if (!result.insertId) {
                throw new Error("Failed to retrieve wallet ID after creation");
            }
            else {
                walletId = result.insertId;
            }
        }
        catch (error) {
            throw new Error(`Failed to create wallet: ${error instanceof Error ? error.message : "Unknown error"}`);
        }
        const userSql = "INSERT INTO users (name, email, password, walletId) VALUES (?, ?, ?, ?)";
        try {
            await database_1.connection.query(userSql, [name, email, hash, walletId]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create user: ${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred");
            }
        }
    }
    static async getUser(id) {
        const sql = "SELECT * FROM users WHERE id=?";
        const [rows] = await database_1.connection.query(sql, [id]);
        const user = rows;
        console.log("");
        if (!user.id) {
            console.log(`User with id ${id} not found`);
            return null;
        }
        return user;
    }
    static async existUser(email) {
        const sql = "SELECT * FROM users WHERE email=?";
        const [rows] = await database_1.connection.query(sql, [email]);
        const user = rows;
        return !user ? true : false;
    }
    static async updateUser(id, data) {
        const { name, email, password } = data;
        const hash = bcrypt_1.default.hashSync(password, 8);
        const sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
        try {
            await database_1.connection.query(sql, [name, email, hash, id]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create user: ${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred");
            }
        }
    }
    static async deleteUser(id) {
        try {
            const userSql = "DELETE FROM users WHERE id=?";
            const walletSql = "DELETE FROM wallets WHERE id=?";
            await database_1.connection.query(userSql, [id]);
            await database_1.connection.query(walletSql, [id]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to create user: ${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred");
            }
        }
    }
}
exports.UserModel = UserModel;
