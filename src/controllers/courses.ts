import { Request, Response, NextFunction } from "express";

import { connection } from "../model/database";

export const courses = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const lastCourse = `SELECT * FROM courses ORDER BY created_at DESC LIMIT 1`;
      let [courses]: [Record<string, number>, any] = await connection.query(lastCourse);
    res.json(courses);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};