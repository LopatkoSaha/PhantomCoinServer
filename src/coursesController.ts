
import { connection } from "../src/model/database";
import { configCoins } from "../config/config";

const exchangeGenerator = (prev: number, defaultNum = 2) => {
    if (!prev) {
      return defaultNum;
    }
    const operation = Math.random() - 0.5;
    const rate = prev + operation * 10;
    return Math.floor(rate) < 1 ? 1 : Math.floor(rate);
  };

  type TCoinValues = Record<string, number>;

export const coursesController = () => {
    setInterval(async () => {
        const lastCourse = `SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`;
        let [rows]: [Record<string, number>, any] = await connection.query(lastCourse);
        if(!rows) {
            const currentCoins = Object.entries(configCoins).map(([name, value]) => {
                return `${name} DECIMAL(18, 8) DEFAULT ${value}`;
              });
            await connection.query(`
                CREATE TABLE IF NOT EXISTS courses (
                  id INT AUTO_INCREMENT PRIMARY KEY,
                  ${currentCoins.join()},
                  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                );
              `);
              const coinNames = Object.keys(configCoins);
              const coinValues = Object.values(configCoins);
              const placeholders = coinNames.map(() => '?').join(', ');
              const query = `
                  INSERT INTO courses (${coinNames.join(', ')})
                  VALUES (${placeholders})
              `;
              await connection.query(query, coinValues);
        } else {
            const coinNames = Object.keys(configCoins);   
            const changedCoin = coinNames[Math.floor(Math.random() * coinNames.length)]; 
            const changedValue = exchangeGenerator(+rows[changedCoin]);
            const newCours = coinNames.reduce((acc, item) => {
                if(item === changedCoin) {
                    acc[changedCoin] = changedValue
                 } else {
                    acc[item] = +rows[item]
                 }
                 return acc;
            }, {} as TCoinValues);
            const newCoursNames = Object.keys(newCours);
            const newCoursValues = Object.values(newCours);
            const placeholders = newCoursNames.map(() => '?').join(', ');
            const query = `
                INSERT INTO courses (${newCoursNames.join(', ')})
                VALUES (${placeholders})
            `;
            await connection.query(query, newCoursValues);
        }         
    }, 60000);
}