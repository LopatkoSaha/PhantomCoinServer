import { connection } from "../model/database";
import { configCoins } from "../../config/config";
import { menagePreorders } from "./executionPreorders";
import { wsServer } from "../webSocket/webSocketServer";
import { loger } from "../model/logerModel";
import { LastCourse } from "../model/lastCourseModel";
import { exchangeGenerator } from "./exchangeGenerator";

  type TCoinValues = Record<string, number>;

class CoursesController {
  init (courseUpdateTimeout: number) {
    setInterval(async () => {
        this.calculate(exchangeGenerator)
    }, courseUpdateTimeout);
  }

  private async calculate (exchangeGenerator: (prev: number) => number) {
    const lastCourse = await LastCourse.get();
    if(!lastCourse) {
          const coinNames = Object.keys(configCoins);
          const coinValues = Object.values(configCoins);
          const placeholders = coinNames.map(() => '?').join(', ');
          await connection.query(`INSERT INTO courses (${coinNames.join(', ')}) VALUES (${placeholders})`, 
            coinValues);
    } else {
        const coinNames = Object.keys(configCoins);   
        const changedCoin = coinNames[Math.floor(Math.random() * coinNames.length)];
        const changedValue = exchangeGenerator(+lastCourse[changedCoin]);
        const newCours = coinNames.reduce((acc, item) => {
        if(item === changedCoin) {
            acc[changedCoin] = changedValue
          } else {
            acc[item] = +lastCourse[item]
          }
          return acc;
        }, {} as TCoinValues);
        const newCoursNames = Object.keys(newCours);
        const newCoursValues = Object.values(newCours);
        const placeholders = newCoursNames.map(() => '?').join(', ');
        const query = `INSERT INTO courses (${newCoursNames.join(', ')}) VALUES (${placeholders})`;
        await connection.query(query, newCoursValues);
        menagePreorders([changedCoin]);
        wsServer.send(JSON.stringify(newCours));    
    }
  }
}

export const coursesController = new CoursesController();