import { Request, Response, NextFunction, } from "express";

import { loger } from "../model/logerModel";


export const errors = (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    loger.error({path: req.path, body: req.body, message: error});
    res.status(500).json({ message: "Internal server error" });
};