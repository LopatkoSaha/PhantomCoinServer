"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const walletModel_1 = require("../model/walletModel");
const router = express_1.default.Router();
router.post("/get", async (req, res, next) => {
    const { id } = req.body.user;
    try {
        const wallet = await walletModel_1.WalletModel.getWallet(id);
        if (!wallet) {
            return res.status(404).json({ message: "Wallet not found" });
        }
        res.json(wallet);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/update", async (req, res, next) => {
    const { user, coins } = req.body;
    try {
        await walletModel_1.WalletModel.updateWallet(user.id, coins);
        res
            .status(201)
            .json({ message: `Wallet user with email ${user.email} is updated` });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error creating user:", errorMessage);
        res.status(500).json({ message: errorMessage });
    }
});
router.post("/create", async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        //   await WalletModel.getWallet({ name, email, password });
        //   res.status(201).json({ message: `User with name ${name} is created` });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error creating user:", errorMessage);
        res.status(500).json({ message: errorMessage });
    }
});
exports.default = router;
