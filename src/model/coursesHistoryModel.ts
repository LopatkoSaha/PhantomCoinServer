import { connection } from "./database";

export class CoursesHistory {

    static async getLastCoursesHistory () {
        const coursesLastAll: [Record<string, any>[], any] = await connection.query(`SELECT * FROM courses_history WHERE date = (SELECT MAX(date) FROM courses_history)`);
        return coursesLastAll;
    }

    static async setLastCoursesHistory (newCorsesHistoryDays: Record<string, any>[]) {
        for (let i = 0; i < newCorsesHistoryDays.length; i++) {
            await connection.query(`INSERT INTO courses_history (date, name_coin, open_course, min_course, max_course, close_course) VALUES (?, ?, ?, ?, ?, ?)`,
                [newCorsesHistoryDays[i].date, newCorsesHistoryDays[i].name_coin, newCorsesHistoryDays[i].open_course, newCorsesHistoryDays[i].min_course, newCorsesHistoryDays[i].max_course, newCorsesHistoryDays[i].close_course]);
        }
        console.log("База courses_history обновлена");
        return;
    }

    static async getAllCoursesHistory (nameCoin: string) {
        const allCourse: [Record<string, any>[], any] = await connection.query(`SELECT * FROM courses_history WHERE name_coin = ?`, [nameCoin]);
        return allCourse;
    }
}