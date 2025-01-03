import express, { Router, Request, Response, NextFunction } from "express";
import { WalletModel } from "../model/walletModel";

const router = express.Router();

router.get("/get", async (req: any, res: any, next: NextFunction) => {
  const { id } = req.body.user;

  try {
    const wallet = await WalletModel.getWallet(id);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }
    res.json(wallet);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post(
  "/update",
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, coins } = req.body;
    try {
      await WalletModel.updateWallet(user.id, coins);
      res
        .status(201)
        .json({ message: `Wallet user with id ${user.id} is updated` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating user:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
  }
);

export default router;
