import express from "express";

import { userGet, userUpdate, userDelete } from "../controllers/user";

const router = express.Router();

router.get("/get", userGet);

router.post("/update", userUpdate);

router.delete("/delete", userDelete);

export default router;
