import cors from "cors";
import express from "express";
import path from "path";

import { allowOrigin, appPort } from "../config/config";
import runMigrations from "../src/model/migrationsDB";
import user from "./routers/userRouter";
import auth from "./routers/authRouter";
import wallet from "./routers/walletRouter";
import courses from "./routers/coursesRouter";
import { checkAuthUser } from "./middlewares/authMiddleware";
import { loger } from "./middlewares/logerMiddleware";
import { coursesController } from "./coursesController";

const app = express();

app.use(express.static(path.resolve(__dirname, "build")));
app.use(express.json());
app.use(
  cors({
    allowedHeaders: "*",
    origin: allowOrigin,
  })
);

app.use("/auth", loger, auth);
app.use("/courses", courses);
app.use("/user", checkAuthUser, loger, user);
app.use("/wallet", checkAuthUser, loger, wallet);

(async () => {
  app.listen(appPort, () => {
    console.log(`Listening port ${appPort}`);
  });
  runMigrations();
  coursesController();
})();
