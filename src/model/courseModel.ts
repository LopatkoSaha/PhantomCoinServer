import { connection } from "./database";

export class LastCourse {

    static async getLastCourse () {
        let [courses]: [Record<string, number>, any] = await connection.query(`SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`);
        return courses;
    }

    static async setLastCourse (names: string[], values: any[], ) {
        const placeholders = names.map(() => '?').join(', ');
        await connection.query(`INSERT INTO courses (${names}) VALUES (${placeholders})`, values);
        return;
    }
}