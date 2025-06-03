import express from "express";

import { get, getAllInfo, update, updataAdmin, buyCurrency, buyAllIn } from "../controllers/wallet";
import { validateBody } from "../middlewares/validatorMiddleware";
import { adminWalletsMiddleware } from "../middlewares/adminMiddlewares";

const router = express.Router();

router.get("/get", get);

router.get("/getAllInfo", adminWalletsMiddleware, getAllInfo);

router.post(
    "/update",
    validateBody({
        coins: ["isExistingName"]
    }),
    update
);

router.post(
    "/updataAdmin",
    adminWalletsMiddleware,
    validateBody({
        coins: ["isExistingName"]
    }),
    updataAdmin
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
