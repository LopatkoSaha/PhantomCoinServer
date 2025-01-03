"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database"); // Подключение к базе данных
const config_1 = require("../../config/config");
async function runMigrations() {
    const containWallet = Object.entries(config_1.configWallet).map(([name, value]) => {
        return `${name} DECIMAL(18, 8) DEFAULT ${value}`;
    });
    try {
        // 1. Проверка и создание базы данных
        await database_1.connection.query("CREATE DATABASE IF NOT EXISTS phantomcoin");
        await database_1.connection.query("USE phantomcoin"); // Переход в базу данных
        // 2. Проверка и создание таблицы wallets
        await database_1.connection.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ${containWallet.join()},
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        // 3. Проверка и создание таблицы users
        await database_1.connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        walletId INT,
        FOREIGN KEY (walletId) REFERENCES wallets(id) ON DELETE SET NULL
      );
    `);
        console.log("Migration completed successfully.");
    }
    catch (error) {
        console.error("Migration failed:", error);
    }
}
exports.default = runMigrations;
