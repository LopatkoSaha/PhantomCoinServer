import express from "express";

import { getQR } from "../controllers/generateQR";

const router = express.Router();

router.get("/getQR", getQR);

export default router;