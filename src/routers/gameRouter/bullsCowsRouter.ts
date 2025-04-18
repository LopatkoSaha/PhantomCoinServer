import express from "express";

import { start, move, checkGameSession, stop } from "../../controllers/bullsCows";


const router = express.Router();

router.get("/check", checkGameSession);

router.post("/start", start);

router.post("/move", move);

router.post("/stop", stop);

export default router;