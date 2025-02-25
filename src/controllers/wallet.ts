import { Request, Response, NextFunction } from "express";
import { connection } from "../model/database";
import { WalletModel } from "../model/walletModel";
import { Trasaction } from "../model/transactionModel";
import { verifyBlockchain } from "../helpers/verifyBlockchain";


export const get = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  try {
    const wallet = await WalletModel.getWallet(userId!);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.json(wallet);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    const { coins } = req.body;
    console.log(req.body);
    
    try {
      await WalletModel.updateWallet(userId!, coins);
      res
        .status(201)
        .json({ message: `Wallet user with id ${userId} is updated` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error update wallet:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
};

export const buyCurrency = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    const { saleName, buyName, quantity } = req.body;
    try {
      const lastCourse = `SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`;
      const [courses]: [Record<string, number>, any] = await connection.query(lastCourse);
      courses.usd = 1;
      const wallet = await WalletModel.getWallet(userId!);
      const saleValue = quantity * courses[buyName]/courses[saleName];
      
      if(saleValue > wallet[saleName]) {
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
      res
        .status(201)
        .json({ message: `Deal is success, you buyed ${quantity} ${buyName}` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating user:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
};

export const buyAllIn = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    const { saleName, buyName } = req.body;
    try {
      const lastCourse = `SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`;
      const [courses]: [Record<string, number>, any] = await connection.query(lastCourse);
      courses.usd = 1;
      const wallet = await WalletModel.getWallet(userId!);
      const buyValue = +wallet[saleName] * courses[saleName]/courses[buyName];

      const coins = {
        [saleName]: 0,
        [buyName]: +wallet[buyName] + buyValue,
      }
      await WalletModel.updateWallet(userId!, coins);
      res
        .status(201)
        .json({ message: `Deal is success, you buyed ${buyValue} ${buyName}` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating user:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
};