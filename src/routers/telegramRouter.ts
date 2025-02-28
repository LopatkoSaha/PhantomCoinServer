import express from "express";

import { getQR } from "../controllers/generateQR";
import { validateBody } from "../middlewares/validatorMiddleware";

const router = express.Router();

router.get(
    "/getQR", 
    getQR
);


export default router;