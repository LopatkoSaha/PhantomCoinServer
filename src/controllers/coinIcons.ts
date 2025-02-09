import { Request, Response } from "express";

import getCoinIconsMap from "../model/coinIconsModel"


export const coinIcons = async (req: Request, res: Response): Promise<void> => {
    try {
        const coinIcons = await getCoinIconsMap();
        if (!coinIcons) {
            res.status(404).json({ message: "Wallet not found" });
            return;
        }
        res.json(coinIcons);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};