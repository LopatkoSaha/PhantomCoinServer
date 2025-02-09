import { RowDataPacket } from "mysql2/promise";
import { connection } from "./database";

async function getCoinIconsMap(): Promise<{ [key: string]: string }> {
    try {
        const rows: [RowDataPacket[], any] = await connection.query(`
            SELECT name, icon FROM coinIcons;
        `);
        if (Array.isArray(rows)) {
            const result = rows.reduce((acc, row) => {
                acc[row.name] = row.icon; 
                return acc;
            }, {} as { [key: string]: string });

            return result;
        } else {
            console.error("Data format is not as expected. Expected an array of rows.");
            throw new Error("Data format error");
        }

    } catch (error) {
        console.error("Ошибка при выполнении запроса:", error);
        throw error;
    }
}

export default getCoinIconsMap;
