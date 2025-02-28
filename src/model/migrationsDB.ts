import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { connection } from "./database"; // Подключение к базе данных
import { configWallet, configCoins, configCoinsImg } from "../../config/config";

type TColumnNames = RowDataPacket & {COLUMN_NAME: string};

async function runMigrations() {

  const containWallet = Object.entries(configWallet).map(([name, value]) => {
    return `${name} DECIMAL(10, 2) DEFAULT "${value}"`;
  });

  const currentCoins  = Object.entries(configCoins).map(([name, value]) => {
    return `${name} DECIMAL(10, 2) DEFAULT ${value}`;
  });

  const coinsImg  = Object.entries(configCoinsImg).map(([name, value]) => {
    return `${name} VARCHAR(255) DEFAULT '${value}'`;
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
          ADD COLUMN ${item} DECIMAL(10, 2) DEFAULT 0;  
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
        walletId INT,
        telegram_id VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
          ADD COLUMN ${item} DECIMAL(10, 2) DEFAULT 0;  
        `)
      }
    })

    // 7. Проверка и создание таблицы loger
    await connection.query(`
      CREATE TABLE IF NOT EXISTS loger (
        id INT AUTO_INCREMENT PRIMARY KEY,
        method VARCHAR(100) NOT NULL,
        user_id VARCHAR(100),
        body_JSON VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 8. Проверка и создание таблицы coinsImg
    await connection.query(`
      DROP TABLE IF EXISTS coinIcons;
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS coinIcons (
        name VARCHAR(255) NOT NULL,
        icon TEXT NOT NULL
      );
    `);
    // Автоматическое заполнение таблицы coinsImg ссылками
    const coinsImgData = Object.entries(configCoinsImg).map(
      ([name, value]) => `('${name}', '${value}')`
    );
    
    await connection.query(`
      INSERT INTO coinIcons (name, icon)
      VALUES ${coinsImgData.join(",\n")};
    `);

    // 9. Проверка и создание таблицы preorder
    await connection.query(`
      CREATE TABLE IF NOT EXISTS preorder (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet_id INT UNSIGNED NOT NULL,
        currency_sell ENUM(${Object.keys(configWallet).map((item)=>`'${item}'`).join()}) NOT NULL,
        currency_buy ENUM(${Object.keys(configWallet).map((item)=>`'${item}'`).join()}) NOT NULL,
        value_buy DECIMAL(10, 2) DEFAULT NULL,
        is_all_in TINYINT(1) NOT NULL CHECK (is_active IN (0, 1)),
        trigger_course DECIMAL(10, 2) DEFAULT NULL,
        is_active TINYINT(1) NOT NULL CHECK (is_active IN (0, 1)),
        status ENUM('pending', 'success', 'fail') NOT NULL,
        triggered_at TIMESTAMP NULL DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 10. Проверка и создание таблицы transactions
    await connection.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        wallet_id INT UNSIGNED NOT NULL,
        currency_sell VARCHAR(64) NOT NULL,
        currency_buy VARCHAR(64) NOT NULL,
        value_sell DECIMAL(10, 2) DEFAULT NULL,
        value_buy DECIMAL(10, 2) DEFAULT NULL,
        prev_hash VARCHAR(64),
        hash VARCHAR(64) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 11. Проверка и создание таблицы telegram_tokens
    await connection.query(`
      CREATE TABLE IF NOT EXISTS telegram_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT UNSIGNED NOT NULL,
        token VARCHAR(64) NOT NULL,
        is_active TINYINT(1) NOT NULL CHECK (is_active IN (0, 1)),
        expired_at TIMESTAMP NOT NULL
      );
    `);
    
    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

export default runMigrations;
