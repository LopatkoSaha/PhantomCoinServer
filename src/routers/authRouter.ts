import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import bcrypt from "bcrypt";
import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { jsonExpiresIn, jsonSecretKey } from "../../config/config";
import { LoginError, RegistrationError } from "../errors/errors";
import { UserModel } from "../model/usersModel";
import { connection } from "../model/database";

const router = express.Router();
router.post("/login", async (req: Request, res: any, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const userSql = "SELECT * FROM users WHERE email=?";
    const [rows]: [RowDataPacket, any] = await connection.query(userSql, [
      email,
    ]);
    const user = rows;
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user.id }, jsonSecretKey, {
      expiresIn: jsonExpiresIn,
    });
    return res.json({
      token,
    });
  } catch (error) {
    console.log("Login error=", error);
    res.status(500).json({ message: "Internal server error" });
    next(new LoginError("Login Error"));
  }
});

router.post(
  "/registration",
  async (req: Request, res: any, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const candidate = await UserModel.existUser(email);
      if (!candidate) {
        return res
          .status(400)
          .json({ message: `User with email ${email} already exist` });
      }
      await UserModel.createUser({ name, email, password });
      res
        .status(201)
        .json({ message: `User ${name} wish email ${email} was created` });
    } catch (err) {
      console.log("Registration error:", err);
      next(new RegistrationError("Registration Error"));
    }
  }
);

export default router;
