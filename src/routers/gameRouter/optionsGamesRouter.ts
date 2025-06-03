import express from "express";

import { adminGamesMiddleware } from "../../middlewares/adminMiddlewares";
import { getAllGameOptions, getOneGameOptions, createGameOptions, setBonusCoefficient, updataGameOptions, deleteOptions} from "../../controllers/optionsGames";

const router = express.Router();

router.post("/allGamesOptions", getAllGameOptions);

router.post("/oneGameOptions", getOneGameOptions);

router.post("/createGameOptions", adminGamesMiddleware, createGameOptions);

router.post("/updataGameOptions", adminGamesMiddleware, updataGameOptions);

router.post("/setBonusCoefficient", adminGamesMiddleware, setBonusCoefficient);

router.post("/deleteOptions", adminGamesMiddleware, deleteOptions);


export default router;