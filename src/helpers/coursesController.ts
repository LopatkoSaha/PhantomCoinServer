import { configCoins, wsPortAll } from "../../config/config";
import { menagePreorders } from "./executionPreorders";
import { WSServer } from "../webSocket/webSocketServer";
import { loger } from "../model/logerModel";
import { Course } from "../model/courseModel";
import { generateCurrentCourse } from "./exchangeGenerator";
import { oneCourseController } from "./oneCourseController";

class CoursesController {
  private wsServer: WSServer;

  constructor () {
    this.wsServer = new WSServer("/allCourses", wsPortAll, async () => {
      const dayStartCourses: Record<string, any> = await Course.getDayStartCourses();
      delete dayStartCourses.created_at;
      delete dayStartCourses.id;
      dayStartCourses.isFirst = true;
      return dayStartCourses;
    })
  }

  init (courseUpdateTimeout: number) {
    setInterval(async () => {
        this.calculate()
    }, courseUpdateTimeout);

  }

  // TODO: при добавлении новой монеты в конфиг у нее нет предидущего курса
  private async calculate () {
    const lastCourse = await Course.getLastCourse<Record<keyof typeof configCoins, number>>();
    if(!lastCourse) {
      await Course.setLastCourse(configCoins);
    } else {
      const coinNames = Object.keys(configCoins);   
      const changedCoin = coinNames[Math.floor(Math.random() * coinNames.length)] as unknown as keyof typeof configCoins;
      const changedValue = generateCurrentCourse(+lastCourse[changedCoin], changedCoin);
      const newCourses = {
        ...lastCourse,
        [changedCoin]: changedValue,
      };
      await Course.setLastCourse(newCourses);
      menagePreorders([changedCoin]);
      this.wsServer.broadcast(JSON.stringify(newCourses));
      oneCourseController.sendCourse(changedCoin, changedValue);
    }
  }
}

export const coursesController = new CoursesController();