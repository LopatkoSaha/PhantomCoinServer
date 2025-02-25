import { Request, Response, NextFunction } from "express";
import { connection } from "../model/database";
import { WalletModel } from "../model/walletModel";
import { PreordersModel } from "../model/preordersModel";


export const getPreorders = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  try {
    const wallet = await WalletModel.getWallet(userId!);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    const preorders = await PreordersModel.getPreordersWallet(wallet.id)
    res.json(preorders);
  } catch (error) {
    console.error("Error fetching preorders:", error);
    res.status(500).json({ message: "Fetching preorders error" });
  }
};

export const setPreorder = async (req: Request, res: any, next: NextFunction) => {
    const {userId} = req;
    const conditions = req.body;
    try {
      const wallet = await WalletModel.getWallet(userId!);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      conditions.wallet_id = wallet.id;
      conditions.is_active = 1;
      conditions.status = "pending";
      const messageSetPreorder = await PreordersModel.setPreorder(conditions);
      res.json(messageSetPreorder);
    } catch (error) {
      console.error("Error seting preorder:", error);
      res.status(500).json({ message: "Seting preorder error" });
    }
};

export const removePreorder = async (req: Request, res: any, next: NextFunction) => {
    const {userId} = req;
    const {id} = req.body;

    try {
      const wallet = await WalletModel.getWallet(userId!);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      const message = await PreordersModel.deletePreorder(id, wallet.id)
      res.json(message);
    } catch (error) {
      console.error("Error deleted preorder:", error);
      res.status(500).json({ message: "Deleted preorder error" });
    }
};