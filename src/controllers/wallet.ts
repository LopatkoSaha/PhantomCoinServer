import { Request, Response, NextFunction } from "express";

import { WalletModel } from "../model/walletModel";
import { Trasaction } from "../model/transactionModel";
import { verifyBlockchain } from "../helpers/verifyBlockchain";
import { loger } from "../model/logerModel";
import { LastCourse } from "../model/courseModel";


export const get = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  try {
    const wallet = await WalletModel.getWallet(userId!);
    if (!wallet) {
      loger.warning({ path: req.path, body: req.body, message: "Wallet not found" });
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.json(wallet);
  } catch (error) {
    next(error);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    const { coins } = req.body;
    try {
      await WalletModel.updateWallet(userId!, coins);
      loger.info({ path: req.path, body: req.body, message: `Wallet user with id ${userId} is updated` });
      res
        .status(201)
        .json({ message: `Wallet user with id ${userId} is updated` });
    } catch (error) {
      next(error);
    }
};

export const buyCurrency = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    const { saleName, buyName, quantity } = req.body;
    try {
      const courses = await LastCourse.getLastCourse();
      courses.usd = 1;
      const wallet = await WalletModel.getWallet(userId!);
      const saleValue = quantity * courses[buyName]/courses[saleName];
      
      if(saleValue > wallet[saleName]) {
        loger.warning({ path: req.path, body: req.body, message: `Deal is rejected, no money` });
        res
        .status(400)
        .json({ message: `Deal is rejected, no money` });
        return;
      }
      const coins = {
        [saleName]: +wallet[saleName] - saleValue,
        [buyName]: +wallet[buyName] + quantity,
      }
      await WalletModel.updateWallet(userId!, coins);
      const verifi = await verifyBlockchain();
      if (verifi) {
        Trasaction.addTransaction(wallet.id, saleName, buyName, coins[saleName], coins[buyName]);
      }
      loger.info({ path: req.path, body: req.body, message: `Deal is success, you buyed ${quantity} ${buyName}` });
      res
        .status(201)
        .json({ message: `Deal is success, you buyed ${quantity} ${buyName}` });
    } catch (error) {
      next(error);
    }
};

export const buyAllIn = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    const { saleName, buyName } = req.body;
    try {
      const courses = await LastCourse.getLastCourse();
      courses.usd = 1;
      const wallet = await WalletModel.getWallet(userId!);
      const buyValue = +wallet[saleName] * courses[saleName]/courses[buyName];

      const coins = {
        [saleName]: 0,
        [buyName]: +wallet[buyName] + buyValue,
      }
      await WalletModel.updateWallet(userId!, coins);
      loger.info({ path: req.path, body: req.body, message: `Deal is success, you buyed ${buyValue} ${buyName}` });
      res
        .status(201)
        .json({ message: `Deal is success, you buyed ${buyValue} ${buyName}` });
    } catch (error) {
      next(error);
    }
};