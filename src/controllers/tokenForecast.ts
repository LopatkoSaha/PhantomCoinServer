import { Request, Response, NextFunction } from "express";

import { TokenForecact } from "../model/tokenForecastModel";
import {WalletModel } from "../model/walletModel";
import { crossCourseToken } from "../../config/config";
import { loger } from "../model/logerModel";


export const get = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  try {
    const valueTokens = await TokenForecact.get(userId!);
    res.json(valueTokens);
  } catch (error) {
    next(error);
  }
};

export const set = async (req: Request, res: any, next: NextFunction): Promise<any> => {
  const {userId} = req;
  const {value} = req.body;
  const crossCourse = crossCourseToken || 5;

  try {
    const wallet = await WalletModel.getWallet(userId!);
    if((+value/crossCourse) > +wallet.usd) return `У вас не достаточно денег для покупки ${value} токенов`;
    wallet.usd = wallet.usd - (value/crossCourse);
    await WalletModel.updateWallet(userId!, wallet);
    const currentValueTokens = await TokenForecact.get(userId!);
    const summTokens = +currentValueTokens + value;
    await TokenForecact.set(userId!, summTokens);
    res.json(`Вы купили ${value} токенов`);
    return;
  } catch (error) {
    next(error);
  }
};
