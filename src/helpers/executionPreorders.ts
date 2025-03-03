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
            await tBot.sendMessage(telegramId, `Вы купили  ${valueBuyed} ${currencyBuy}  за  ${valueSold ? valueSold : "все"} ${currencySell} согласно предзаказу созданному ${created_at}`);
        }
        if (status === "fail") {
            await tBot.sendMessage(telegramId, `Выполнение тразакции отменено, не достаточно средств ${currencySell} для покупки ${valueBuyed} ${currencyBuy}, согласно предзаказу созданному ${created_at}`);
        } 
}

export const menagePreorders = async (nameChangedCoin: string[]) => {
    const lastCourseSql = `SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`;
    let [lastCourse]: [RowDataPacket[], any] = await connection.query(lastCourseSql);
    nameChangedCoin.forEach((item) => processPreorders(item, lastCourse));
};

const processPreorders = async (nameChangedCoin: string, lastCourse: Record<string, any>) => {
    try {
        const preordersToProcess = await PreordersModel.getProcessPreorders(nameChangedCoin, lastCourse)

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
                        const newValueCurrencyBuy = +(+item[currencyBuy] + (+valueBuy));

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

