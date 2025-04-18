import { Request, Response, NextFunction } from "express";

import { GamesSessionsModel } from "../model/gamesSessionsModel";
import { GamesModel } from "../model/gamesModel";
import { GamesOptionsModel } from "../model/gamesOptionsModel";
import { CheckIQ } from "../helpers/checkIQ";
import { WalletModel } from "../model/walletModel";
import { loger } from "../model/logerModel";

export const checkGameSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const gameInfo = await GamesModel.getGameInfo("checkIQ");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (activeSession) {
            const state = JSON.parse(activeSession.state);
            const checkIQ = new CheckIQ(state);
            if(checkIQ.chackGameExpired()) {
                await GamesSessionsModel.finishGame(activeSession.id, "loss");
                checkIQ.setGameLoss();
                res.json(checkIQ.createReturn());
            }
            res.json(checkIQ.createReturn());
        }   
        res.json(activeSession);
    } catch (error) {
        next(error);
    }
};

export const start = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const {complexity, payoutValue, payoutCurrency} = req.body;
        const gameInfo = await GamesModel.getGameInfo("checkIQ");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (activeSession) {
            loger.error({ path: req.path, body: req.body, message: `User id = ${userId!} is having active game ${gameInfo.name}` })
            res.json({message: `User is having active game ${gameInfo.name}`});
            return;
        }
        const wallet = await WalletModel.getWallet(userId!);
        if (wallet[payoutCurrency] < payoutValue) {
            res.json({message: `Your wallet no ${payoutValue} ${payoutCurrency}`});
            return;
        }
        const coins = {[payoutCurrency]: wallet[payoutCurrency] - payoutValue};
        await WalletModel.updateWallet(userId!, coins);
        const gameOptions = await GamesOptionsModel.getOneGameOptions(gameInfo.id, complexity);
        const gameConfig = JSON.parse(gameOptions.game_config);
        const defaultState = CheckIQ.defaultState(gameConfig.turns, gameConfig.timeGaming, gameConfig.timeShowField, gameConfig.x, gameConfig.y);
        const checkIQ = new CheckIQ(defaultState);
        const state = JSON.stringify(checkIQ.getData());
        const bidValue = payoutValue * gameOptions.bonus_coefficient;
        await GamesSessionsModel.creatActiveSession(gameInfo.id, userId!, state, "active", payoutValue, payoutCurrency, bidValue);
        const data = checkIQ.createReturn();
        const newData = {
            ...data,
            field: checkIQ.allIsOpen(),
        }
        res.json(newData);
    } catch (error) {
        next(error);
    }
};

export const init = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const gameInfo = await GamesModel.getGameInfo("checkIQ");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (!activeSession) {
            loger.error({ path: req.path, body: req.body, message: `User id = ${userId!} is not active game ${gameInfo.name}` })
            res.json({message: `User is not active game ${gameInfo.name}`});
            return;
        }
        const checkIQ = new CheckIQ(JSON.parse(activeSession.state));
        checkIQ.initGame();
        const state = JSON.stringify(checkIQ.getData());
        await GamesSessionsModel.setGameData(activeSession.id, state);
        res.json(checkIQ.createReturn());
    } catch (error) {
        next(error);
    }
};

export const move = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const {moveData} = req.body;
        const gameInfo = await GamesModel.getGameInfo("checkIQ");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (!activeSession) {
            res.json({message: "Active game is not"});
            return;
        }
        const checkIQ = new CheckIQ(JSON.parse(activeSession?.state));
        checkIQ.move(moveData);
        const state = checkIQ.getData();

        await GamesSessionsModel.setGameData(activeSession.id, JSON.stringify(state));
        
        if (checkIQ.getStatus() === "win") {
            const wallet = await WalletModel.getWallet(userId!);
            const coins = {[activeSession.payout_currency]: +wallet[activeSession.payout_currency] + +activeSession.bid_value};     
            await WalletModel.updateWallet(userId!, coins);
        }
        await GamesSessionsModel.finishGame(activeSession.id, checkIQ.getStatus());

        res.json(checkIQ.createReturn());
    } catch (error) {   
        next(error);
    }
};

export const stop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const gameInfo = await GamesModel.getGameInfo("checkIQ");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (!activeSession) {
            loger.error({ path: req.path, body: req.body, message: `User id = ${userId!} is not active game ${gameInfo.name}` })
            res.json({message: `User is not active game ${gameInfo.name}`});
            return;
        }
        await GamesSessionsModel.finishGame(activeSession.id, "loss"); 
        res.json({message: "Game over"});
    } catch (error) {
        next(error);
    }
}