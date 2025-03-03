import { createClient } from "redis";

class RedisDB{
    private redisClient;

    constructor () {
        this.redisClient = createClient();
        this.redisClient.on("error", (err: any) => console.error("Redis Client Error", err));
        this.startRedis();
    }

    private async startRedis() {
        await this.redisClient.connect();
        console.log("🚀 Redis подключен");
    }
    
    // ✅ Сохранение токена с временем жизни (например, 10 минут)
    public async saveToken(token: string, userId: string) {
        await this.redisClient.set(`token:${token}`, userId, {
        EX: 600, // Время жизни в секундах (10 минут)
        });
        console.log(`🔒 Токен сохранён для пользователя ${userId}`);
    }
  
    // ✅ Проверка токена
    public async getToken(token: string) {
        const userId = await this.redisClient.get(`token:${token}`);
        if (userId) {
        console.log(`✅ Токен действителен для пользователя ${userId}`);
        } else {
        console.log("❌ Токен не найден или истёк");
        }
        return userId;
    }
  
    // ✅ Удаление токена вручную (по желанию)
    public async deleteToken(token: string) {
        await this.redisClient.del(`token:${token}`);
        console.log("🗑️ Токен удалён");
    }
}

export const RedisDb = new RedisDB();