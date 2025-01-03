"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../config/config");
const errors_1 = require("../errors/errors");
const usersModel_1 = require("../model/usersModel");
const database_1 = require("../model/database");
const router = express_1.default.Router();
router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const userSql = "SELECT * FROM users WHERE email=?";
        const [rows] = await database_1.connection.query(userSql, [
            email,
        ]);
        const user = rows;
        if (!user) {
            return res.status(404).json({ message: "Invalid email" });
        }
        const isMatch = bcrypt_1.default.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(404).json({ message: "Invalid password" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, config_1.jsonSecretKey, {
            expiresIn: config_1.jsonExpiresIn,
        });
        return res.json({
            token,
        });
    }
    catch (error) {
        console.log("Login error=", error);
        res.status(500).json({ message: "Internal server error" });
        next(new errors_1.LoginError("Login Error"));
    }
});
router.post("/registration", async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const candidate = await usersModel_1.UserModel.existUser(email);
        if (!candidate) {
            return res
                .status(400)
                .json({ message: `User with email ${email} already exist` });
        }
        await usersModel_1.UserModel.createUser({ name, email, password });
        res
            .status(201)
            .json({ message: `User ${name} wish email ${email} was created` });
    }
    catch (err) {
        console.log("Registration error:", err);
        next(new errors_1.RegistrationError("Registration Error"));
    }
});
exports.default = router;
