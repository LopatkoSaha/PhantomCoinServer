import { Request, Response, NextFunction } from 'express';

import { loger } from "../model/logerModel";
import { AdminModel } from "../model/adminModel";

export const adminUsersMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req;
  try {
        const adminPermissions = await AdminModel.getAdminPermissions(+userId!);
        if(adminPermissions?.users === 1) {
            next();
        } else {
            loger.warning({ path: req.path, body: req.body, message: "No admin permission for users" });
            res.status(401).send({ message: "No admin permission for users" });
        }
    } catch (error) {
    next(error);
  }
};

export const adminWalletsMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    try {
          const adminPermissions = await AdminModel.getAdminPermissions(+userId!);
          if(adminPermissions?.wallets === 1) {
              next();
          } else {
              loger.warning({ path: req.path, body: req.body, message: "No admin permission for wallets" });
              res.status(401).send({ message: "No admin permission for wallets" });
          }
      } catch (error) {
      next(error);
    }
  };

  export const adminGamesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    try {
          const adminPermissions = await AdminModel.getAdminPermissions(+userId!);
          if(adminPermissions?.games === 1) {
              next();
          } else {
              loger.warning({ path: req.path, body: req.body, message: "No admin permission for games" });
              res.status(401).send({ message: "No admin permission for games" });
          }
      } catch (error) {
      next(error);
    }
  };