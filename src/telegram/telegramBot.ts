import {Telegraf, Context} from "telegraf";

import { UserModel } from "../model/usersModel";
import { WalletModel } from "../model/walletModel";
import { telegramBotToken } from "../../config/config";
import { TelegramKeyboards } from "./telegramKeyboards";
import { redisDb } from "../redisDb/redisDb";



class TelegramBot {
    private bot: Telegraf;

    constructor () {
        this.bot = new Telegraf(telegramBotToken);
        this.bot.start(this.startHandler);
        this.bot.action("get_wallet", this.getWallet);
    }

    init() {
        this.bot.launch();
    }

    async startHandler(ctx: any) {
        const chatId = ctx.chat.id;
        const token = ctx.message.text.split(" ")[1]; // Получаем уникальный token пользователя из QR-кода

        if (!token) {
            return ctx.reply("Привет! Чтобы использовать бота, откройте его через QR-код.");
        }
        const userId =  await redisDb.getToken(token);
        if (!userId) {
            return ctx.reply("Привет! Чтобы использовать бота, откройте его через QR-код.");
        }
        
        await UserModel.updateTelegramId(Number(userId), chatId);
        await redisDb.deleteToken(token);
        ctx.reply(
            `Привет! Вы успешно подписались на PhantomCoin`,
            TelegramKeyboards.startKeyboard()
        );
    }

    async sendMessage(chatId: string, message: string) {
        await this.bot.telegram.sendMessage(chatId, message);
    }

    async getWallet(ctx: Context) {
        const user = await UserModel.getUserByTelegramId(ctx.chat?.id ?? 0);
        if (!user) {
            return ctx.reply("Привет! Чтобы использовать бота, откройте его через QR-код.");
        }
        const wallet = await WalletModel.getWallet(user.id);

        const walletForTelegram: Record<string, any> = Object.entries(wallet).reduce(
            (acc: Record<string, any>, [key, value]) => {
                if (key !== "id" && key !== "created_at") acc[key] = Number(value).toFixed(2);
                return acc;
            },
            {}
        );
        return ctx.reply(`<pre>${JSON.stringify(walletForTelegram, null, 2)}</pre>`, { parse_mode: "HTML" });
    }
}

export const tBot = new TelegramBot();
