import { Request, Response, NextFunction } from "express";

import { LastCourse } from "../model/courseModel";

export const courses = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const courses = LastCourse.getLastCourse();
      res.json(courses);
  } catch (error) {
    next(error);
  }
};