import cors from "cors";
import express from "express";
import path from "path";
import cookieParser from 'cookie-parser';

import "./cron";
import { allowOrigin, appPort, courseUpdateTimeout } from "../config/config";
import runMigrations from "../src/model/migrationsDB";
import user from "./routers/userRouter";
import auth from "./routers/authRouter";
import wallet from "./routers/walletRouter";
import courses from "./routers/coursesRouter";
import coinIcons from "./routers/coinIconsRouter";
import preorders from "./routers/preordersRouter";
import telegram from "./routers/telegramRouter";
import chat from "./routers/chatRouter";
import tokenForecast from "./routers/tokenForecastRouter";
import { errors } from "./routers/errorRouter";
import { authMiddleware } from "./middlewares/authMiddleware";
import { coursesController } from "./helpers/coursesController";
import { tBot } from "./telegram/telegramBot";
import { redisDb } from "./redisDb/redisDb";
import { kafkaProducer } from "./kafkaProducer";
import { mistralLlm } from "./llmModels/mistlslLlm";

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
app.use("/chat", authMiddleware, chat);
app.use("/tokenForecast", authMiddleware, tokenForecast);
app.use(errors);

(async () => {
  await runMigrations();
  await redisDb.startRedis();
  await kafkaProducer.startProducer();
  coursesController.init(courseUpdateTimeout);
  tBot.init();
  mistralLlm.init();
  app.listen(appPort, () => {
    console.log(`Listening port ${appPort}`);
  });
})();
