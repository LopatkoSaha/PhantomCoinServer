import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { connection } from "./database"; // Подключение к базе данных
import { configWallet } from "../../config/config";

async function runMigrations() {
  const containWallet = Object.entries(configWallet).map(([name, value]) => {
    return `${name} DECIMAL(18, 8) DEFAULT ${value}`;
  });

  try {
    // 1. Проверка и создание базы данных
    await connection.query("CREATE DATABASE IF NOT EXISTS phantom_coin");
    await connection.query("USE phantom_coin"); // Переход в базу данных

    // 2. Проверка и создание таблицы wallets
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ${containWallet.join()},
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Проверка и создание таблицы users
    await connection.query(`
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
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

export default runMigrations;
