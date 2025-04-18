import { Request, Response, NextFunction } from "express";

import { GamesSessionsModel } from "../model/gamesSessionsModel";
import { GamesModel } from "../model/gamesModel";
import { GamesOptionsModel } from "../model/gamesOptionsModel";
import { WalletModel } from "../model/walletModel";
import { loger } from "../model/logerModel";
import { Minesweeper } from "../helpers/minesweeper";
import { IGame } from "../types/IGame";

type TGameState = {
    x: number,
    y: number,
    bombCount: number,
    isFirstClick: boolean,
    fieldData: any[]
}

function checkSessionController(gameState: TGameState) {    
    const ms = new Minesweeper(gameState.fieldData);
    return ms.createReturn(gameState.x, gameState.y, null);
}

function moveController(clickId: number, gameState: TGameState) {
    const {fieldData, x, y, bombCount, isFirstClick} = gameState;
    const ms = new Minesweeper(fieldData);
    if (!gameState.isFirstClick) {
        ms.initGame(x, y, bombCount, clickId);
        gameState.isFirstClick = true;
    }
    ms.move(clickId);
    return {
        createReturn: ms.createReturn(x, y, clickId),
        newGameState: ms.createStateDb(x, y, bombCount, null, gameState.isFirstClick),
    };
}

function flagController(rightClickId: number, gameState: TGameState) {
    const {fieldData, x, y, bombCount, isFirstClick} = gameState;
    const ms = new Minesweeper(fieldData);
    ms.setFlag(rightClickId);
    return {
        createReturn: ms.createReturn(x, y, null),
        newGameState: ms.createStateDb(x, y, bombCount, null, isFirstClick),
    };
}

export const checkGameSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const gameInfo = await GamesModel.getGameInfo("minesweeper");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (!activeSession) {
            res.json(activeSession);
            return;
        }
        const data = checkSessionController(JSON.parse(activeSession.state));
        res.json(data);
    } catch (error) {
        next(error);
    }
}

export const start = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const {complexity, payoutValue, payoutCurrency} = req.body;
        const gameInfo = await GamesModel.getGameInfo("minesweeper");
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
        const bidValue = +gameOptions.bonus_coefficient * +payoutValue;
        const {rows, colums, mine} = JSON.parse(gameOptions.game_config);
        const defaultFieldData = Minesweeper.defaultGameState(rows, colums, mine);
        await GamesSessionsModel.creatActiveSession(gameInfo.id, userId!, JSON.stringify(defaultFieldData), "active", payoutValue, payoutCurrency ,bidValue);
        res.json(defaultFieldData);
    } catch (error) {
        next(error);
    }
}

export const move = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const {clickId} = req.body;
        const gameInfo = await GamesModel.getGameInfo("minesweeper");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (!activeSession) {
            loger.error({ path: req.path, body: req.body, message: `User id = ${userId!} is not active game ${gameInfo.name}` })
            res.json({message: `User is not active game ${gameInfo.name}`});
            return;
        }
        const gameState = JSON.parse(activeSession.state);
        const resultMove = moveController(clickId, gameState);
        if(resultMove.createReturn.status === "win") {
            const wallet = await WalletModel.getWallet(userId!);
            const coins = {[activeSession.payout_currency]: +wallet[activeSession.payout_currency] + +activeSession.bid_value};
            await WalletModel.updateWallet(userId!, coins);
            await GamesSessionsModel.finishGame(activeSession.id, "win");
        }
        if(resultMove.createReturn.status === "loss") {
            await GamesSessionsModel.finishGame(activeSession.id, "loss");
        }
        await GamesSessionsModel.setGameData(activeSession.id, JSON.stringify(resultMove.newGameState));
        res.json(resultMove.createReturn);
    } catch (error) { 
        next(error);
    }
}

export const setFlag = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const {clickId} = req.body;
        const gameInfo = await GamesModel.getGameInfo("minesweeper");
        const activeSession = await GamesSessionsModel.findActiveSession(userId!, gameInfo.id);
        if (!activeSession) {
            loger.error({ path: req.path, body: req.body, message: `User id = ${userId!} is not active game ${gameInfo.name}` })
            res.json({message: `User is not active game ${gameInfo.name}`});
            return;
        }
        const state = JSON.parse(activeSession.state);
        const resultMove = flagController(clickId, state);
        await GamesSessionsModel.setGameData(activeSession.id, JSON.stringify(resultMove.newGameState));
        res.json(resultMove.createReturn);
    } catch (error) {
        next(error);
    }
}

export const stop = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {userId} = req;
        const gameInfo = await GamesModel.getGameInfo("minesweeper");
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