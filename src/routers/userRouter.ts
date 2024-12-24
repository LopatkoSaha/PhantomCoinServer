import express, { Router, Request, Response, NextFunction } from "express";
import { UserModel } from "../model/usersModel";
import { checkAuthUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;

    try {
      await UserModel.createUser({ name, email, password });
      res.status(201).json({ message: `User with name ${name} is created` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating user:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
  }
);

router.post(
  "/get",
  checkAuthUser,
  async (req: any, res: any, next: NextFunction) => {
    const { id } = req.body.user;

    if (!id) {
      return res.status(400).json({ message: "Email is required" });
    }

    try {
      const user = await UserModel.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

router.post(
  "/update",
  checkAuthUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, name, email, password } = req.body;
    try {
      await UserModel.updateUser(user.id, { name, email, password });
      res.status(201).json({ message: `User with name ${name} is updated` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error creating user:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
  }
);

router.delete(
  "/delete",
  checkAuthUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.body.user;
    console.log("id: ", id);

    try {
      const user = await UserModel.getUser(id);
      console.log("user: ", user);
      if (!user) {
        res.status(201).json({ message: `User is not exist` });
        return;
      }
      await UserModel.deleteUser(id);
      res
        .status(201)
        .json({ message: `User with name ${user?.name} is deleted` });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error delete user:", errorMessage);
      res.status(500).json({ message: errorMessage });
    }
  }
);

export default router;
