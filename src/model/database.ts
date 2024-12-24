import {
  createPool,
  Pool,
  RowDataPacket,
  ResultSetHeader,
} from "mysql2/promise";
import { config } from "../../config/server_config";

class MySQLConnect {
  public pool: Pool;
  constructor() {
    this.pool = createPool({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      //   database: config.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  async query<T extends RowDataPacket[] | ResultSetHeader>(
    sql: string,
    values?: any[]
  ): Promise<T> {
    try {
      const [result] = await this.pool.query<T>(sql, values);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export const connection = new MySQLConnect();
