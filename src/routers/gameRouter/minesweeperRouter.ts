import express from "express";

import { start, move, checkGameSession, setFlag, stop } from "../../controllers/minesweeper";


const router = express.Router();

router.get("/check", checkGameSession);

router.post("/start", start);

router.post("/move", move);

router.post("/setFlag", setFlag);

router.post("/stop", stop);

export default router;