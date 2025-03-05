import { Request, Response, NextFunction } from "express";

import { deepSeek } from "../deepSeek";
import { loger } from "../model/logerModel";

export const chat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { message } = req.body;
        const reply = await deepSeek(message);

        if (!reply) {
            loger.warning({ path: req.path, body: req.body, message: 'Error response deepSeek' });
            res.status(404).json({ message: "Ошибка ответа deepSeek" });
            return;
        }
        res.json(reply);
    } catch (error: any) {
        if (error.code === 'insufficient_quota') {
            loger.warning({ path: req.path, body: req.body, message: 'LLM quota has expired' });
            res.status(429).json({ message: "Закончилась квота LLM. Попробуйте позже." });
            return;
        }
        next(error);
    }
};
