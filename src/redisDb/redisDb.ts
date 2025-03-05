import { createClient } from "redis";

class RedisDB {
    private redisClient;

    constructor (private prefix: string, private ttl: number) {
        this.redisClient = createClient();
        this.redisClient.on("error", (err: any) => console.error("Redis Client Error", err));
    }

    async startRedis() {
        await this.redisClient.connect();
        console.log("🚀 Redis подключен");
    }
    
    public async saveToken(token: string, userId: number) {
        await this.redisClient.set(`${this.prefix}:${token}`, userId, {
        EX: this.ttl,
        });
        console.log(`🔒 Токен сохранён для пользователя ${userId}`);
    }
  
    public async getToken(token: string) {
        const userId = await this.redisClient.get(`${this.prefix}:${token}`);
        if (userId) {
        console.log(`✅ Токен действителен для пользователя ${userId}`);
        } else {
        console.log("❌ Токен не найден или истёк");
        }
        return userId;
    }
  
    public async deleteToken(token: string) {
        await this.redisClient.del(`${this.prefix}:${token}`);
        console.log("🗑️ Токен удалён");
    }
}

export const redisDb = new RedisDB("token", 600);