import express from "express";

import { get, set } from "../controllers/tokenForecast";

const router = express.Router();

router.get("/get", get);

router.post("/set", set);

export default router;