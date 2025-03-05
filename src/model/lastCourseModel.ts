import { connection } from "../model/database";

export class LastCourse {

    static async get () {
        let [courses]: [Record<string, number>, any] = await connection.query(`SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`);
        return courses;
    }
}