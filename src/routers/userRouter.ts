import express from "express";

import { adminGet, userGet, userUpdate, userDelete, allUsersGet, activationUser, deactivationUser } from "../controllers/user";
import { adminUsersMiddleware } from "../middlewares/adminMiddlewares";

const router = express.Router();

router.get("/admin", adminGet);

router.get("/get", userGet);

router.get("/getAll", adminUsersMiddleware, allUsersGet);

router.post("/update", adminUsersMiddleware, userUpdate);

router.post("/activation", adminUsersMiddleware, activationUser);

router.post("/deactivation", adminUsersMiddleware, deactivationUser);

router.delete("/delete", adminUsersMiddleware, userDelete);

export default router;
