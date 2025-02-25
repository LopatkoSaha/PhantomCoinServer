import { Request, Response, NextFunction } from "express";
import { UserModel } from "../model/usersModel";

export const userGet = async (req: Request, res: any, next: NextFunction) => {
    const {userId} = req;
    if (!userId) {
      return res.status(400).json({ message: "Id is required" });
    }
    try {
      const user = await UserModel.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
};

export const userUpdate = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    const { name, email, password } = req.body;
    try {
      await UserModel.updateUser(userId!, { name, email, password });
      res.status(201).json({ message: `User with name ${name} is updated` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating user:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
};

export const userDelete = async (req: Request, res: Response, next: NextFunction) => {
    const {userId} = req;
    try {
      const user = await UserModel.getUser(userId!);
      if (!userId) {
        res.status(201).json({ message: `User is not exist` });
        return;
      }
      await UserModel.deleteUser(userId);
      res
        .status(201)
        .json({ message: `User with name ${user?.name} is deleted` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error delete user:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
};

