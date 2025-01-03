"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = void 0;
const database_1 = require("./database");
class WalletModel {
    static async getWallet(userId) {
        try {
            const walletSql = "SELECT * FROM wallets WHERE id IN (SELECT users.walletId FROM users WHERE id = ?)";
            const [rows] = await database_1.connection.query(walletSql, [
                userId,
            ]);
            const wallet = rows;
            return wallet;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to geted wallet: ${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred");
            }
        }
    }
    static async updateWallet(userId, coins) {
        let coinNames = [];
        let coinValues = [];
        Object.entries(coins).forEach(([name, value]) => {
            coinNames.push(`${name} = ?`);
            coinValues.push(value);
        });
        const walletSql = `UPDATE wallets SET ${coinNames.join()} WHERE id = ${userId}`;
        try {
            await database_1.connection.query(walletSql, coinValues);
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to updated wallet: ${error.message}`);
            }
            else {
                throw new Error("An unknown error occurred");
            }
        }
    }
    static async creatWallet() { }
    static async deleteWallet(id) {
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
exports.WalletModel = WalletModel;
