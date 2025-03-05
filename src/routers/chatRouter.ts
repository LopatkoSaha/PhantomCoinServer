import express from "express";

import { chat } from "../controllers/chat";

const router = express.Router();

router.all("/*",  chat);

export default router;
