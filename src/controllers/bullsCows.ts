import { Request, Response, NextFunction } from "express";

import { GamesSessionsModel } from "../model/gamesSessionsModel";
import { GamesModel } from "../model/gamesModel";
import { GamesOptionsModel } from "../model/gamesOptionsModel";
import { BullsCows } from "../helpers/bullsCows";
import { WalletModel } from "../model/walletModel";
import { loger } from "../model/logerModel";

export const checkGameSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const gameInfo = await GamesModel.getGameInfo("bullsCows");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (activeSession) {
            const state = JSON.parse(activeSession.state);
            const gameData = {
                status: activeSession.status,
                turns: state.turns,
                moves: state.moves,
                quest: [],
                colorsCount: state.colorsCount,
                colors: state.colors,
            };
            res.json(gameData);
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
        const gameInfo = await GamesModel.getGameInfo("bullsCows");
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
        const defaultState = BullsCows.defaultState(gameConfig.length, gameConfig.steps);
        const bullsCows = new BullsCows(defaultState);
        bullsCows.initGame(gameConfig.length, gameConfig.steps);
        const state = JSON.stringify(bullsCows.getData());
        const bidValue = payoutValue * gameOptions.bonus_coefficient;
        await GamesSessionsModel.creatActiveSession(gameInfo.id, userId!, state, "active", payoutValue, payoutCurrency, bidValue);

        res.json(bullsCows.createReturn());
    } catch (error) {
        next(error);
    }
};

export const move = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const {moveData} = req.body;
        const gameInfo = await GamesModel.getGameInfo("bullsCows");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (!activeSession) {
            res.json({message: "Active game is not"});
            return;
        }
        const bullsCows = new BullsCows(JSON.parse(activeSession?.state));
        bullsCows.move(moveData);
        const data = bullsCows.getData();

        await GamesSessionsModel.setGameData(activeSession.id, JSON.stringify(data));
        
        if (bullsCows.getStatus() === "win") {
            const wallet = await WalletModel.getWallet(userId!);
            const coins = {[activeSession.payout_currency]: +wallet[activeSession.payout_currency] + +activeSession.bid_value};
            console.log(coins);       
            await WalletModel.updateWallet(userId!, coins);
        }
        await GamesSessionsModel.finishGame(activeSession.id, bullsCows.getStatus());

        res.json(bullsCows.createReturn());
    } catch (error) {   
        next(error);
    }
};

export const stop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const gameInfo = await GamesModel.getGameInfo("bullsCows");
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