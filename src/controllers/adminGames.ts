import { Request, Response, NextFunction } from "express";

import { GamesModel } from "../model/gamesModel";
import { GamesOptionsModel } from "../model/gamesOptionsModel";
import { loger } from "../model/logerModel";


export const getGameInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {nameGame} = req.body;
        const info = await GamesModel.getGameInfo(nameGame);
        if (!info) {
            loger.warning({ path: req.path, body: req.body, message: 'Game info not found' });
            res.json(null);
            return;
        }
        const options = await GamesOptionsModel.getAllGameOptions(info.id);
        if (!options) {
            loger.warning({ path: req.path, body: req.body, message: 'Game options not found' });
            res.json(null);
            return;
        }
        res.json({info, options});
    } catch (error) {
        next(error);
    }
};

export const createGame = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const {nameGame, discription} = req.body;
    try {
        const gameInfo = await GamesModel.getGameInfo(nameGame);
        if (gameInfo.name === nameGame) {
            res.json({ message: `Game with name ${nameGame} already exist`});
            return;
        };
        await GamesModel.createGame(nameGame, discription);
        res.json({ message: `Game info about ${nameGame} is created` });
    } catch (error) {
        next(error);
    }
};

export const setGameInfo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id, nameGame, discription} = req.body;
        await GamesModel.setGameInfo(id, nameGame, discription);
        res.json({ message: `Game info about ${nameGame} is seted` });
    } catch (error) {
        next(error);
    }
};