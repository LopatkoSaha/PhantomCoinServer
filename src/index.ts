import cors from "cors";
import express from "express";
import path from "path";

import { allowOrigin, appPort } from "../config/config";
import user from "./routers/userRouter";
import auth from "./routers/authRouter";
import wallet from "./routers/walletRouter";
import runMigrations from "../src/model/migrationsDB";
import { checkAuthUser } from "./middlewares/authMiddleware";

const app = express();

app.use(express.static(path.resolve(__dirname, "build")));
app.use(express.json());
app.use(
  cors({
    allowedHeaders: "*",
    origin: allowOrigin,
  })
);

app.use("/auth", auth);
app.use("/user", user);
app.use("/wallet", checkAuthUser, wallet);

(async () => {
  app.listen(appPort, () => {
    console.log(`Listening port ${appPort}`);
  });
  runMigrations();
})();
