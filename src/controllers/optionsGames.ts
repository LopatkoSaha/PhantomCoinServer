import { Request, Response, NextFunction } from "express";

import { GamesOptionsModel } from "../model/gamesOptionsModel";

import { loger } from "../model/logerModel";


export const getAllGameOptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {gameId} = req.body;
        const allGameOptions = await GamesOptionsModel.getAllGameOptions(gameId);
        res.json(allGameOptions);
    } catch (error) {
        next(error);
    }
};

export const getOneGameOptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {gameId, nameComplexity} = req.body;
        const oneGameOptions = await GamesOptionsModel.getOneGameOptions(gameId, nameComplexity);
        res.json(oneGameOptions);
    } catch (error) {
        next(error);
    }
};

export const createGameOptions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {gameId, nameComplexity, bonusCoefficient, discriptionComplexity, sortOrder, gameConfig} = req.body;
        const oneGameOptions = await GamesOptionsModel.getOneGameOptions(gameId, nameComplexity);
        if (oneGameOptions[0].name_complexity === nameComplexity) {
            res.json({ message: `Game options name_complexity ${nameComplexity} about game with game_id = ${gameId} already exist` });
            return;
        }
        if (oneGameOptions[0].sort_order === sortOrder) {
            res.json({ message: `Game options sort_order ${sortOrder} about game with game_id = ${gameId} already exist` });
            return;
        }
        await GamesOptionsModel.createGameOptions(gameId, nameComplexity, bonusCoefficient, discriptionComplexity, sortOrder, gameConfig);
        res.json({ message: `Game options ${nameComplexity} about game with game_id = ${gameId} is created` });
    } catch (error) {
        next(error);
    }
};

export const setBonusCoefficient = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id, bonusCoefficient} = req.body;
        await GamesOptionsModel.setBonusCoefficient(id, bonusCoefficient);
        res.json({ message: `Bonus coefficient for game with id = ${id} is seted` });
    } catch (error) {
        next(error);
    }
};