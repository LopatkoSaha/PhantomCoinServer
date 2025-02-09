import express from "express";

import { login, logout, registration } from "../controllers/auth";

const router = express.Router();

router.post("/login", login);

router.post("/logout", logout);

router.post("/registration", registration);

export default router;
