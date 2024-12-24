import { NextFunction } from "express";
import jwt from "jsonwebtoken";

import { JsonWebTokenError, TokenExpiredError } from "../errors/errors";
import { jsonSecretKey } from "../../config/config";

export async function checkAuthUser(req: any, res: any, next: NextFunction) {
  if (!req.headers.token) {
    next(new TokenExpiredError("Token is Not or Expired Error"));
  }
  jwt.verify(req.headers.token, jsonSecretKey, (err: any, decoded: any) => {
    if (err) {
      console.log("err=", err);
      next(new JsonWebTokenError("Json Web Token Error"));
    } else {
      req.body.user = { id: decoded.id };
      next();
    }
  });
}
