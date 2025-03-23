import { Request, Response, NextFunction } from "express";

import { WalletModel } from "../model/walletModel";
import { PreordersModel } from "../model/preordersModel";
import { loger } from "../model/logerModel";


export const getPreorders = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  try {
    const wallet = await WalletModel.getWallet(userId!);
    if (!wallet) {
      loger.warning({ path: req.path, body: req.body, message: "Wallet not found" });
      return res.status(404).json({ message: "Wallet not found" });
    }
    const preorders = await PreordersModel.getPreordersWallet(wallet.id)
    res.json(preorders);
  } catch (error) {
    next(error);
  }
};

export const setPreorder = async (req: Request, res: any, next: NextFunction) => {
    const {userId} = req;
    const conditions = req.body;
    try {
      const wallet = await WalletModel.getWallet(userId!);
      if (!wallet) {
        loger.warning({ path: req.path, body: req.body, message: "Wallet not found" });
        return res.status(404).json({ message: "Wallet not found" });
      }
      conditions.wallet_id = wallet.id;
      conditions.is_active = 1;
      conditions.status = "pending";
      const messageSetPreorder = await PreordersModel.setPreorder(conditions);
      res.json(messageSetPreorder);
    } catch (error) {
      next(error);
    }
};

export const removePreorder = async (req: Request, res: any, next: NextFunction) => {
    const {userId} = req;
    const {id} = req.body;
    try {
      const wallet = await WalletModel.getWallet(userId!);
      if (!wallet) {
        loger.warning({ path: req.path, body: req.body, message: "Wallet not found" });
        return res.status(404).json({ message: "Wallet not found" });
      }
      const message = await PreordersModel.deletePreorder(id, wallet.id)
      res.json(message);
    } catch (error) {
      next(error);
    }
};