import express from "express";

import { getGameInfo, createGame,setGameInfo } from "../../controllers/adminGames";

const router = express.Router();

router.post("/getGameInfo", getGameInfo);

router.post("/createGame", createGame);

router.post("/setGameInfo", setGameInfo);

export default router;