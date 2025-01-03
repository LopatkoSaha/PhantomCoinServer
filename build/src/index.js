"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config/config");
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const authRouter_1 = __importDefault(require("./routers/authRouter"));
const walletRouter_1 = __importDefault(require("./routers/walletRouter"));
const migrationsDB_1 = __importDefault(require("../src/model/migrationsDB"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.resolve(__dirname, "build")));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    allowedHeaders: "*",
    origin: config_1.allowOrigin,
}));
app.use("/auth", authRouter_1.default);
app.use("/user", userRouter_1.default);
app.use("/wallet", authMiddleware_1.checkAuthUser, walletRouter_1.default);
(async () => {
    app.listen(config_1.appPort, () => {
        console.log(`Listening port ${config_1.appPort}`);
    });
    (0, migrationsDB_1.default)();
})();
