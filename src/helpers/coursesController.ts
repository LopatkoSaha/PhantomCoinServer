import { configCoins, wsPortAll } from "../../config/config";
import { menagePreorders } from "./executionPreorders";
import { WSServer } from "../webSocket/webSocketServer";
import { loger } from "../model/logerModel";
import { LastCourse } from "../model/courseModel";
import { exchangeGenerator } from "./exchangeGenerator";
import { oneCourseController } from "./oneCourseController";

  type TCoinValues = Record<string, number>;

class CoursesController {
  private wsServer: WSServer;

  constructor () {
    this.wsServer = new WSServer("/allCourses", wsPortAll, async () => {
      return "Hello"; // Отправляем курсы всех валют на начало дня
    })
  }

  init (courseUpdateTimeout: number) {
    setInterval(async () => {
        this.calculate(exchangeGenerator)
    }, courseUpdateTimeout);

  }

  private async calculate (exchangeGenerator: (prev: number) => number) {
    const lastCourse = await LastCourse.getLastCourse();
    if(!lastCourse) {
          const coinNames = Object.keys(configCoins);
          const coinValues = Object.values(configCoins);
          await LastCourse.setLastCourse(coinNames, coinValues);
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
      await LastCourse.setLastCourse(newCoursNames, newCoursValues);
      menagePreorders([changedCoin]);
      this.wsServer.broadcast(JSON.stringify(newCours));
      oneCourseController.sendCourse(changedCoin, changedValue);
    }
  }
}

export const coursesController = new CoursesController();