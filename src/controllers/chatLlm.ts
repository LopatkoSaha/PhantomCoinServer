import { Request, Response, NextFunction } from "express";

import { loger } from "../model/logerModel";
import { createdMessageForLlm } from "../llmModels/createdMessageForLlm";
import { mistralLlm } from "../llmModels/mistlslLlm";
import { TokenForecact } from "../model/tokenForecastModel";

export const chatLlm = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId } = req;
        const { nameCoin, period } = req.body;
        const tokens = await TokenForecact.get(+userId!);
        if (!tokens) {
            loger.warning({ path: req.path, body: req.body, message: 'No tokens' });
            res.json("У Вас закончились токены");
            return;
        };
        const ask = createdMessageForLlm(nameCoin, period);
        const reply = await mistralLlm.askModel(ask);
        if (!reply) {
            loger.warning({ path: req.path, body: req.body, message: 'Error response chatLlm' });
            res.status(404).json({ message: "Ошибка ответа chatLlm" });
            return;
        };
        const decrement = +tokens - 1;
        await TokenForecact.set(userId!, decrement)
        res.json(reply);
    } catch (error: any) {
        next(error);
    }
};
