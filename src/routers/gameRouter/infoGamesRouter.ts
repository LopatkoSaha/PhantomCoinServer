import express from "express";

import { adminGamesMiddleware } from "../../middlewares/adminMiddlewares";
import { getAllGamesInfo, getGameInfo, createGameInfo, setGameInfo } from "../../controllers/adminGames";

const router = express.Router();

router.get("/getAllGameInfo", getAllGamesInfo);

router.post("/getGameInfo", getGameInfo);

router.post("/createGameInfo", adminGamesMiddleware, createGameInfo);

router.post("/setGameInfo", adminGamesMiddleware, setGameInfo);

export default router;