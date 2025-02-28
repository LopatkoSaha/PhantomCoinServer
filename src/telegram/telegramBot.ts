import {Telegraf, Context} from "telegraf";
import { RowDataPacket, ResultSetHeader } from "mysql2/promise";

import { connection } from "../model/database";
import { TelegramTokenModel } from "../model/telegramTokenModel";
import { UserModel } from "../model/usersModel";
import { WalletModel } from "../model/walletModel";
import { telegramBotToken } from "../../config/config";
import { TelegramKeyboards } from "./telegramKeyboards";



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
        const tokenRecord =  await TelegramTokenModel.findByToken(token);
        if (!tokenRecord) {
            return ctx.reply("Привет! Чтобы использовать бота, откройте его через QR-код.");
        }
        if (tokenRecord.is_active === 0) {
            return ctx.reply(`Привет! Создайте новый QR код в личном кабинете PhantomCoin`);
        } 
        if (new Date(tokenRecord.expired_at) < new Date()) {
            return ctx.reply(`Привет! Срок действия QR кода истек, создайте новый`);
        }
        await UserModel.updateTelegramId(tokenRecord.user_id, chatId);
        await TelegramTokenModel.deactivate(tokenRecord.id);
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
        return ctx.reply(JSON.stringify(wallet));
    }
}

export const tBot = new TelegramBot();
