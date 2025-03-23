import { connection } from "./database";

export class Course {

    static async getLastCourse<T extends Record<string, number>> () {
        const [lastCourses]: [T, any] = await connection.query(`SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`);
        delete lastCourses.id;
        delete lastCourses.created_at;
        return lastCourses;
    }

    static async setLastCourse (courses: Record<string, number> ) {
        const names = Object.keys(courses);
        const values = Object.values(courses);
        const placeholders = names.map(() => '?').join(', ');
        await connection.query(`INSERT INTO courses (${names}) VALUES (${placeholders})`, values);
    }

    static async getDayStartCourses () {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        let [firstDayCourses]: [Record<string, number>, any] = await connection.query(`SELECT * FROM courses WHERE created_at > "${startDate.toISOString()}" ORDER BY created_at ASC LIMIT 1`);
        return firstDayCourses;
    }

    static async getAllDayCourses () {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        let allDayCourses: [Record<string, number>, any] = await connection.query(`SELECT * FROM courses WHERE created_at > "${startDate.toISOString()}" ORDER BY created_at ASC`);
        return allDayCourses;
    }

    static async getCoursesOneDay (date: Date) {
        const coursesOneDay: [Record<string, any>[], any] = await connection.query(`SELECT * FROM courses WHERE created_at > ? AND created_at <= ?`,
            [date, new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000)]
          );
        return coursesOneDay;
    }
}