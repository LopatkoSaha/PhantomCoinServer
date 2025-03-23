import express from "express";

import { coursesLast, coursesAll} from "../controllers/courses";

const router = express.Router();

router.get("/get", coursesLast);

router.post("/all", coursesAll);

export default router;