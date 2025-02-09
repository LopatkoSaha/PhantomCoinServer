import express from "express";

import { courses } from "../controllers/courses";

const router = express.Router();

router.get("/get", courses);

export default router;