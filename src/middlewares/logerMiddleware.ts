import { NextFunction } from "express";

import { connection } from "../model/database";


export async function loger(req: any, res: any, next: NextFunction) {
  const userId = req.body.user ?  req.body.user.id : null;
  const bodyJSON = JSON.stringify(req.body);
  const method = req.method;

  const logerSql =
        "INSERT INTO loger (method, user_id, body_JSON) VALUES (?, ?, ?)";
      try {
        await connection.query(logerSql, [method, userId, bodyJSON]);
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(`Failed to loger ${error.message}`);
        } else {
          throw new Error("An unknown error occurred");
        }
      }
    next();
}