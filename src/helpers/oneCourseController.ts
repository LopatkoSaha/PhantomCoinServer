import { connection } from "../model/database";
import { wsPortOne } from "../../config/config";
import { menagePreorders } from "./executionPreorders";
import { WSServer } from "../webSocket/webSocketServer";
import { loger } from "../model/logerModel";
import { LastCourse } from "../model/courseModel";
import { exchangeGenerator } from "./exchangeGenerator";

  type TCoinValues = Record<string, number>;

class OneCourseController {
  private wsServer: WSServer;

  constructor () {
    this.wsServer = new WSServer("/oneCourse", wsPortOne, async (currency: string) => {
      return `Your courses for ${currency}`; // Должны отдать статистику по курсу определенной валюты с начала дня(00,00,00)
    })
  }

  public async sendCourse (currency: string, course: number) {
    this.wsServer.send(currency, course.toString());  
  }
}

export const oneCourseController = new OneCourseController();