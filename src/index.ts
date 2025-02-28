import cors from "cors";
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';


import { allowOrigin, appPort } from "../config/config";
import runMigrations from "../src/model/migrationsDB";
import user from "./routers/userRouter";
import auth from "./routers/authRouter";
import wallet from "./routers/walletRouter";
import courses from "./routers/coursesRouter";
import coinIcons from "./routers/coinIconsRouter";
import preorders from "./routers/prordersRouter";
import telegram from "./routers/telegramRouter";
import { authMiddleware } from "./middlewares/authMiddleware";
import { loger } from "./middlewares/logerMiddleware";
import { coursesController } from "./helpers/coursesController";
import { tBot } from "./telegram/telegramBot";

const app = express();

app.use(express.static(path.resolve(__dirname, "build")));
app.use(express.json());
app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(cookieParser());

app.use("/auth", auth);
app.use("/coinIcons", coinIcons);
app.use("/courses", courses);
app.use("/user", authMiddleware, user);
app.use("/wallet", authMiddleware, wallet);
app.use("/preorders", authMiddleware, preorders);
app.use("/telegram", authMiddleware, telegram);

(async () => {
  app.listen(appPort, () => {
    console.log(`Listening port ${appPort}`);
  });
  runMigrations();
  coursesController();
  tBot.init();
})();
