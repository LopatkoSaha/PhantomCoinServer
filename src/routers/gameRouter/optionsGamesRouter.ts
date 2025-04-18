import express from "express";

import { getAllGameOptions, getOneGameOptions, createGameOptions, setBonusCoefficient} from "../../controllers/optionsGames";

const router = express.Router();

router.post("/allGamesOptions", getAllGameOptions);

router.post("/oneGameOptions", getOneGameOptions);

router.post("/createGameOptions", createGameOptions);

router.post("/setBonusCoefficient", setBonusCoefficient);


export default router;