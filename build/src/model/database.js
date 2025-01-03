"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const promise_1 = require("mysql2/promise");
const server_config_1 = require("../../config/server_config");
class MySQLConnect {
    constructor() {
        this.pool = (0, promise_1.createPool)({
            host: server_config_1.config.host,
            port: server_config_1.config.port,
            user: server_config_1.config.user,
            password: server_config_1.config.password,
            //   database: config.database,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
    }
    async query(sql, values) {
        try {
            const [result] = await this.pool.query(sql, values);
            return result;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.connection = new MySQLConnect();
