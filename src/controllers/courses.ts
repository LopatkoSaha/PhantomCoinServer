import { Request, Response, NextFunction } from "express";

import { Course } from "../model/courseModel";
import { CoursesHistory } from "../model/coursesHistoryModel";
import { redisDb } from "../redisDb/redisDb";

export const coursesLast = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const courses = Course.getLastCourse();
      res.json(courses);
  } catch (error) {
    next(error);
  }
};

export const coursesAll = async (req: Request, res: Response, next: NextFunction) => {
  const { nameCoin } = req.body;
  try {
    const coursesCoinRedis = await redisDb.getCoursesHistory(nameCoin);
    if (coursesCoinRedis) {
      res.json(coursesCoinRedis);
    } else {
      const courses = await CoursesHistory.getAllCoursesHistory(nameCoin);
      await redisDb.saveCourseHistory(nameCoin, JSON.stringify(courses));
      const coursesCoinRedis = await redisDb.getCoursesHistory(nameCoin);
      res.json(coursesCoinRedis);
    }
  } catch (error) {
    next(error);
  }
};