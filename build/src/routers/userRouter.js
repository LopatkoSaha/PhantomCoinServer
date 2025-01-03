"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersModel_1 = require("../model/usersModel");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post("/create", async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        await usersModel_1.UserModel.createUser({ name, email, password });
        res.status(201).json({ message: `User with name ${name} is created` });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error creating user:", errorMessage);
        res.status(500).json({ message: errorMessage });
    }
});
router.post("/get", authMiddleware_1.checkAuthUser, async (req, res, next) => {
    const { id } = req.body.user;
    if (!id) {
        return res.status(400).json({ message: "Email is required" });
    }
    try {
        const user = await usersModel_1.UserModel.getUser(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.post("/update", authMiddleware_1.checkAuthUser, async (req, res, next) => {
    const { user, name, email, password } = req.body;
    try {
        await usersModel_1.UserModel.updateUser(user.id, { name, email, password });
        res.status(201).json({ message: `User with name ${name} is updated` });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error creating user:", errorMessage);
        res.status(500).json({ message: errorMessage });
    }
});
router.delete("/delete", authMiddleware_1.checkAuthUser, async (req, res, next) => {
    const { id } = req.body.user;
    console.log("id: ", id);
    try {
        const user = await usersModel_1.UserModel.getUser(id);
        console.log("user: ", user);
        if (!user) {
            res.status(201).json({ message: `User is not exist` });
            return;
        }
        await usersModel_1.UserModel.deleteUser(id);
        res
            .status(201)
            .json({ message: `User with name ${user?.name} is deleted` });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Error delete user:", errorMessage);
        res.status(500).json({ message: errorMessage });
    }
});
exports.default = router;
