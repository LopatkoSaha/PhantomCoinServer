import { Request, Response, NextFunction } from "express";

import getCoinIconsMap from "../model/coinIconsModel";
import { loger } from "../model/logerModel";


export const coinIcons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const coinIcons = await getCoinIconsMap();
        if (!coinIcons) {
            loger.warning({ path: req.path, body: req.body, message: 'Wallet not found' });
            res.status(404).json({ message: "Wallet not found" });
            return;
        }
        res.json(coinIcons);
    } catch (error) {
        next(error);
    }
};