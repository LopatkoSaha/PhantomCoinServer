import express from "express";

import { coinIcons } from "../controllers/coinIcons";

const router = express.Router();

router.get("/get", coinIcons);

export default router;