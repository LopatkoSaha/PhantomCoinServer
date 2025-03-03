import { Request, Response, NextFunction } from "express";

import { generateTelegramQR } from "../telegram/telegramQR";
import { UserModel } from "../model/usersModel";
import { TelegramTokenModel } from "../model/telegramTokenModel";
import { getRandomString } from "../helpers/randomString";
import { redisDb } from "../redisDb/redisDb";



export const getQR = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  try {
    if(userId){
        const user = await UserModel.getUser(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found"});
        }
        const token = getRandomString(20);
        await redisDb.saveToken(token, userId);
        res.json( await generateTelegramQR(token));
    }
  } catch (error) {
    console.error("Error fetching preorders:", error);
    res.status(500).json({ message: "Fetching preorders error" });
  }
};