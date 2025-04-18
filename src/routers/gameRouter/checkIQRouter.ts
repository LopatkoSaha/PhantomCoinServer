import express from "express";

import { start, init, move, checkGameSession, stop } from "../../controllers/checkIQ";


const router = express.Router();

router.get("/check", checkGameSession);

router.post("/start", start);

router.post("/move", move);

router.post("/init", init);

router.post("/stop", stop);

export default router;