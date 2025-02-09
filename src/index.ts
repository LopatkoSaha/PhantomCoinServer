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
import { authMiddleware } from "./middlewares/authMiddleware";
import { loger } from "./middlewares/logerMiddleware";
import { coursesController } from "../src/handlers/coursesController";

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
app.use("/courses", courses);
app.use("/user", authMiddleware, user);
app.use("/wallet", authMiddleware, wallet);
app.use("/coinIcons", coinIcons);

(async () => {
  app.listen(appPort, () => {
    console.log(`Listening port ${appPort}`);
  });
  runMigrations();
  coursesController();
})();
