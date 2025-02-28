import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import moment from "moment";

import { connection } from "../model/database";
import { WalletModel } from "../model/walletModel";
import { PreordersModel } from "../model/preordersModel";
import { tBot } from "../telegram/telegramBot";

const sendMessage = async (
    status: "success" | "fail", 
    telegramId: string | null,
    currencyBuy: string, 
    currencySell: string, 
    valueBuyed: number, 
    valueSold: number | null, 
    created_at: string) => {

        if (!telegramId) {
            return console.log("Сработал триггер не подписанного на телегу чувака")
        }
        if (status === "success"){
            await tBot.sendMessage(telegramId, `Вы купили  ${valueBuyed.toFixed(2)} ${currencyBuy}  за  ${valueSold ? valueSold.toFixed(2) : "все"} ${currencySell} согласно предзаказу созданному ${created_at}`);
        }
        if (status === "fail") {
            await tBot.sendMessage(telegramId, `Выполнение тразакции отменено, не достаточно средств ${currencySell} для покупки ${valueBuyed.toFixed(2)} ${currencyBuy}, согласно предзаказу созданному ${created_at}`);
        } 
}

export const menagePreorders = async (nameChangedCoin: string[]) => {
    const lastCourseSql = `SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`;
    let [lastCourse]: [RowDataPacket[], any] = await connection.query(lastCourseSql);
    nameChangedCoin.forEach((item) => processPreorders(item, lastCourse));
};

const processPreorders = async (nameChangedCoin: string, lastCourse: Record<string, any>) => {
    lastCourse.usd = 1;
    try {
        const preordersToProcessSql =`
            SELECT 
                u.name AS userName,
                u.id AS userId,
                u.telegram_id AS telegramId,
                p.id AS preorderId,
                p.wallet_id AS walletId,
                p.currency_sell AS currencySell,
                p.currency_buy AS currencyBuy,
                p.value_buy AS valueBuy,
                p.is_all_in AS isAllIn,
                p.trigger_course AS triggerCourse,
                p.created_at AS createdAt,
                w.*
            FROM preorder p 
            LEFT JOIN wallets w ON p.wallet_id = w.id 
            LEFT JOIN users u ON w.id = u.walletId 
            WHERE p.currency_buy = ? 
            AND p.is_active = 1
            AND p.trigger_course >= ?
            `;
        const preordersToProcess: [RowDataPacket[], any] = await connection.query(preordersToProcessSql, [
            nameChangedCoin, lastCourse[nameChangedCoin]
        ]);

        preordersToProcess.forEach(async(item) => {
            const {
                userId,
                telegramId,
                preorderId,
                currencySell,
                currencyBuy,
                valueBuy = +item.valueBuy,
                isAllIn = +item.isAllIn,
                triggerCourse = +item.triggerCourse,
                createdAt,
            } = item;
                
                
            const courseCurrencySell = +lastCourse[currencySell];
            const courseCurrencyBuy = +lastCourse[currencyBuy];
            
            if (triggerCourse){
                if (!isAllIn && !valueBuy) {
                    console.log(`Ошибка данных, поля isAllIn и valueBuy не заполнены в предзаказе с id =${preorderId}`);
                    return
                }
                if (isAllIn) {
                    const valueBuyed = (courseCurrencyBuy * (+item[currencySell]/courseCurrencySell));
                    const newValueCurrencySell = 0;
                    const newValueCurrencyBuy = +item[currencyBuy] + valueBuyed;

                    const conditionsUpdatePreorder = {
                        is_active: 0,
                        status: 'success',
                        triggered_at: moment().format("YYYY-MM-DD HH:mm:ss")
                    };

                    const changedCoinsForWallet = {
                        [currencySell]: newValueCurrencySell,
                        [currencyBuy]: newValueCurrencyBuy,
                    };
                    console.log(+item[currencySell], courseCurrencySell, courseCurrencyBuy, +item[currencyBuy],valueBuyed, newValueCurrencyBuy);
                    
                    await WalletModel.updateWallet(userId, changedCoinsForWallet);
                    await PreordersModel.updatePreorder(preorderId, conditionsUpdatePreorder);
                    await sendMessage("success", telegramId, currencyBuy, currencySell, valueBuyed, +item[currencySell], moment(createdAt).format("YYYY-MM-DD HH:mm:ss"));
                    return
                }
                if (valueBuy) {
                    const opportunity: number = ((+item[currencySell] * courseCurrencySell) - (courseCurrencyBuy * (+valueBuy)));
                    if(opportunity <= 0){
                        const conditionsUpdatePreorder = {
                            is_active: 0,
                            status: 'fail',
                            triggered_at: moment().format("YYYY-MM-DD HH:mm:ss")
                        };
                        await PreordersModel.updatePreorder(preorderId, conditionsUpdatePreorder);
                        await sendMessage("fail", telegramId, currencyBuy, currencySell, valueBuy, null, moment(createdAt).format("YYYY-MM-DD HH:mm:ss"));
                        return
                    } else {
                        const valueSell = (courseCurrencyBuy * (+valueBuy/courseCurrencySell));
                        const newValueCurrencySell = (+item[currencySell] - valueSell);
                        const newValueCurrencyBuy = +(+item[currencyBuy] + (+valueBuy)).toFixed(2);

                        const conditionsUpdatePreorder = {
                            is_active: 0,
                            status: 'success',
                            triggered_at: moment().format("YYYY-MM-DD HH:mm:ss")
                        };

                        const changedCoinsForWallet = {
                            [currencySell]: newValueCurrencySell,
                            [currencyBuy]: newValueCurrencyBuy,
                        };

                        await WalletModel.updateWallet(userId, changedCoinsForWallet);
                        await PreordersModel.updatePreorder(preorderId, conditionsUpdatePreorder);
                        await sendMessage("success", telegramId, currencyBuy, currencySell, valueBuy, valueSell, moment(createdAt).format("YYYY-MM-DD HH:mm:ss"));
                    }
                }
            }
        })
      return preordersToProcess;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process preorders: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
}

