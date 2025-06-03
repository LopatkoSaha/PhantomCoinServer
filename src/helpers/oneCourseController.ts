import { wsPortOne } from "../../config/config";
import { WSServer } from "../webSocket/webSocketServer";
import { Course } from "../model/courseModel";


class OneCourseController {
  private wsServer: WSServer;

  constructor () {
    this.wsServer = new WSServer("/oneCourse", wsPortOne, async (currency: string) => {
      const allDayCourses = await Course.getAllDayCourses();
      return allDayCourses.map((item) => ({
        course: item[currency],
        created_at: item.created_at,
      }));
    });
  }

  public async sendCourse (currency: string, course: number) {
    this.wsServer.send(currency, JSON.stringify({course, created_at: new Date().toISOString()}));  
  }
}

export const oneCourseController = new OneCourseController();