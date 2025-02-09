import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";

import { secret } from "../../config/config";

declare module 'express' {
  interface Request {
    userId?: number;
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.auth_token;
  if (!token) {
    res.status(401).send({ message: 'Unauthorized' });
    return;
  }
  try {
    const decoded = jwt.verify(token, secret);
    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
      req.userId = (decoded as JwtPayload).id as number;
      next();
    } else {
      res.status(401).send({ message: 'Invalid token payload' });
    }
  } catch (error) {
    res.status(401).send({ message: 'Invalid token' });
  }
};
