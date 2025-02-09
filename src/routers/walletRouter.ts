import express from "express";

import { get, update, buyCurrency, buyAllIn } from "../controllers/wallet";
import { validateBody } from "../middlewares/validatorMiddleware";

const router = express.Router();

router.get("/get", get);

router.post(
    "/update",
    validateBody({
        coins: ["isExistingName"]
    }),
    update
);

router.post(
    "/buyCurrency", 
    validateBody({
        saleName: ["required", "isCurrencyName"],
        buyName: ["required", "isCurrencyName"],
        quantity: ["required", "noNegativeNumber"],
    }), 
    buyCurrency
);

router.post(
    "/buyAllIn", 
    validateBody({
        saleName: ["required", "isCurrencyName"],
        buyName: ["required", "isCurrencyName"],
    }), 
    buyAllIn
);

export default router;
