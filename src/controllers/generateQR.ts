import { Request, Response, NextFunction } from "express";

import { generateTelegramQR } from "../telegram/telegramQR";
import { UserModel } from "../model/usersModel";
import { TelegramTokenModel } from "../model/telegramTokenModel";



export const getQR = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  try {
    if(userId){
        const user = await UserModel.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found"});
        }
        const token = Date.now().toString();
        await TelegramTokenModel.create(userId, token, new Date(Date.now() + 120000));
        res.json( await generateTelegramQR(token));
    }
  } catch (error) {
    console.error("Error fetching preorders:", error);
    res.status(500).json({ message: "Fetching preorders error" });
  }
};