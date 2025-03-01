import { Markup} from "telegraf";

export class TelegramKeyboards {
    
    static startKeyboard() {
        return  Markup.inlineKeyboard([
            Markup.button.callback("💰 Get Wallet", "get_wallet"),
        ])
    }
}
