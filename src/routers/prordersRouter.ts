import express from "express";

import { getPreorders, setPreorder, removePreorder} from "../controllers/preorder";
import { validateBody } from "../middlewares/validatorMiddleware";

const router = express.Router();

router.get(
    "/get", 
    getPreorders
);

router.post(
    "/set",
    setPreorder
);

router.delete(
    "/delete",  
    removePreorder
);

export default router;
