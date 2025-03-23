import express from "express";

import { chatLlm } from "../controllers/chatLlm";

const router = express.Router();

router.all("/*",  chatLlm);

export default router;
