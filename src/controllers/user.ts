import { Request, Response, NextFunction } from "express";

import { UserModel } from "../model/usersModel";
import { loger } from "../model/logerModel";

export const adminGet = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  if (!userId) {
    loger.warning({ path: req.path, body: req.body, message: "Id is required" });
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const user = await UserModel.getAdmin(userId);
    if (!user) {
      loger.warning({ path: req.path, body: req.body, message: "User not found" });
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const userGet = async (req: Request, res: any, next: NextFunction) => {
  const {userId} = req;
  if (!userId) {
    loger.warning({ path: req.path, body: req.body, message: "Id is required" });
    return res.status(400).json({ message: "Id is required" });
  }
  try {
    const user = await UserModel.getUser(userId);
    if (!user) {
      loger.warning({ path: req.path, body: req.body, message: "User not found" });
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const allUsersGet = async (req: Request, res: any, next: NextFunction) => {
  try {
    const users = await UserModel.getAllUsers();
    if (!users) {
      loger.warning({ path: req.path, body: req.body, message: "Users not found" });
      return res.status(404).json({ message: "Users not found" });
    }
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const userUpdate = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req;
  const { name, email, password } = req.body;
  try {
    await UserModel.updateUser(userId!, { name, email, password });
    loger.info({ path: req.path, body: req.body, message: `User with name ${name} is updated` });
    res.status(201).json({ message: `User with name ${name} is updated` });
  } catch (error) {
    next(error);
  }
};

export const activationUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  try {
    await UserModel.activationUser(userId);
    loger.info({ path: req.path, body: req.body, message: `User with id ${userId} is activated` });
    res.status(201).json({ message: `User with id ${userId} is activated` });
  } catch (error) {
    next(error);
  }
};

export const deactivationUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  try {
    await UserModel.deactivationUser(userId);
    loger.info({ path: req.path, body: req.body, message: `User with id ${userId} is deactivated` });
    res.status(201).json({ message: `User with id ${userId} is deactivated` });
  } catch (error) {
    next(error);
  }
};

export const userDelete = async (req: Request, res: Response, next: NextFunction) => {
  const {userId} = req;
  try {
    const user = await UserModel.getUser(userId!);
    if (!userId) {
      loger.warning({ path: req.path, body: req.body, message: `User is not exist` });
      res.status(401).json({ message: `User is not exist` });
      return;
    }
    await UserModel.deleteUser(userId);
    loger.info({ path: req.path, body: req.body, message: `User with name ${user?.name} is deleted` });
    res
      .status(201)
      .json({ message: `User with name ${user?.name} is deleted` });
  } catch (error) {
    next(error);
  }
};

