import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { connection } from "./database"; // Подключение к базе данных
import { configWallet, configCoins } from "../../config/config";

type TColumnNames = RowDataPacket & {COLUMN_NAME: string};

async function runMigrations() {

  const containWallet = Object.entries(configWallet).map(([name, value]) => {
    return `${name} DECIMAL(18, 8) DEFAULT ${value}`;
  });

  const currentCoins  = Object.entries(configCoins).map(([name, value]) => {
    return `${name} DECIMAL(18, 8) DEFAULT ${value}`;
  });

  try {
    // 1. Проверка и создание базы данных
    await connection.query("CREATE DATABASE IF NOT EXISTS phantomcoin");
    await connection.query("USE phantomcoin"); // Переход в базу данных

    // 2. Проверка и создание таблицы wallets
    await connection.query(`
      CREATE TABLE IF NOT EXISTS wallets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ${containWallet.join()},
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. Проверка наличия всех колонок в таблице wallets
    const columnsWalletsDb = await connection.query<TColumnNames[]>(`
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = 'phantomcoin'
        AND TABLE_NAME = 'wallets'
    `)
    const currentWalletColumnNames = columnsWalletsDb.map((item) => {
        return item.COLUMN_NAME
    });
    // Добавить колонку если не существует
    Object.keys(configCoins).forEach(async (item) => {
      if(!currentWalletColumnNames.includes(item)){
        await connection.query(`
          ALTER TABLE wallets
          ADD COLUMN ${item} DECIMAL(18, 8) DEFAULT 0;  
        `)
      }
    })

    // 4. Проверка и создание таблицы users
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

    // 5. Проверка и создание таблицы courses
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ${currentCoins.join()},
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Проверка наличия всех колонок в таблице courses
    const columnsCoursesDb = await connection.query<TColumnNames[]>(`
      SELECT COLUMN_NAME
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = 'phantomcoin'
        AND TABLE_NAME = 'courses'
    `)
    const currentColumnNames = columnsCoursesDb.map((item) => {
        return item.COLUMN_NAME
    });
    // Добавить колонку если не существует
    Object.keys(configCoins).forEach(async (item) => {
      if(!currentColumnNames.includes(item)){
        await connection.query(`
          ALTER TABLE courses
          ADD COLUMN ${item} DECIMAL(18, 8) DEFAULT 0;  
        `)
      }
    })

    // 6. Проверка и создание таблицы loger
    await connection.query(`
      CREATE TABLE IF NOT EXISTS loger (
        id INT AUTO_INCREMENT PRIMARY KEY,
        method VARCHAR(100) NOT NULL,
        user_id VARCHAR(100),
        body_JSON VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

export default runMigrations;
