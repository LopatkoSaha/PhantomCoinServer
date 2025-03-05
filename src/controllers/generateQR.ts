import { Request, Response, NextFunction } from "express";

import { generateTelegramQR } from "../telegram/telegramQR";
import { UserModel } from "../model/usersModel";
import { getRandomString } from "../helpers/randomString";
import { redisDb } from "../redisDb/redisDb";
import { loger } from "../model/logerModel";



export const getQR = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  try {
    if(userId){
        const user = await UserModel.getUser(userId);
        if (!user) {
          loger.warning({ path: req.path, body: req.body, message: "User not found" });
          return res.status(404).json({ message: "User not found"});
        }
        const token = getRandomString(20);
        await redisDb.saveToken(token, userId);
        res.json(await generateTelegramQR(token));
    }
  } catch (error) {
    next(error);
  }
};