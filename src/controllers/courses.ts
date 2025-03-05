import { Request, Response, NextFunction } from "express";

import { LastCourse } from "../model/lastCourseModel";

export const courses = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const courses = LastCourse.get();
      res.json(courses);
  } catch (error) {
    next(error);
  }
};