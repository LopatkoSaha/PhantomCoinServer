import express from "express";

import { getPreorders, setPreorder, removePreorder} from "../controllers/preorder";

const router = express.Router();

router.get("/get", getPreorders);

router.post("/set", setPreorder);

router.delete("/delete", removePreorder);

export default router;
