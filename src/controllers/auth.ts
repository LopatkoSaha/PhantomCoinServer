import { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";


import { LoginError, RegistrationError } from "../errors/errors";
import { UserModel } from "../model/usersModel";
import { connection } from "../model/database";
import { generateToken } from "../handlers/generateToken";

export const login = async (req: Request, res: any, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const userSql = "SELECT * FROM users WHERE email=?";
    const [user]: [RowDataPacket, any] = await connection.query(userSql, [
      email,
    ]);
    if (!user) {
      return res.status(404).json({ message: "Invalid email" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = generateToken(user.id);
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    res.send({ message: 'Login successful' });
  } catch (error) {
    console.log("Login error=", error);
    res.status(500).json({ message: "Internal server error" });
    next(new LoginError("Login Error"));
  }
};

export const logout =
  async (req: Request, res: any, next: NextFunction) => {
    res.clearCookie('auth_token');
    res.status(200).json({ message: 'Logged out successfully' });
};

export const registration =
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
  };