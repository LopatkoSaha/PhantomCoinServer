import { RowDataPacket } from "mysql2/promise";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

import { UserModel } from "../model/usersModel";
import { connection } from "../model/database";
import { generateToken } from "../helpers/generateToken";
import { loger } from "../model/logerModel";

export const login = async (req: Request, res: any, next: NextFunction) => {
  const { email, password } = req.body;
  try {
    const [user]: [RowDataPacket, any] = await connection.query(
      "SELECT * FROM users WHERE email=?", 
      [email]
    );
    if (!user) {
      loger.warning({ path: req.path, body: req.body, message: 'Invalid email' });
      return res.status(404).json({ message: "Invalid email" });
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      loger.warning({ path: req.path, body: req.body, message: 'Invalid email' });
      return res.status(404).json({ message: "Invalid password" });
    }

    const token = generateToken(user.id);
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });
    loger.info({path: req.path, message: 'Login successful'});
    res.send({ message: 'Login successful' });
  } catch (err) {
      next(err);
  }
};

export const logout =
  async (req: Request, res: Response, next: NextFunction) => {
    loger.info({path: req.path, message: 'Logged out successfully'});
    res.clearCookie('auth_token');
    res.status(200).json({ message: 'Logged out successfully' });
};

export const registration =
  async (req: Request, res: any, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;
      const candidate = await UserModel.existUser(email);
      if (!candidate) {
        loger.warning({ path: req.path, body: req.body, message: `User with email ${email} already exist` });
        return res
          .status(400)
          .json({ message: `User with email ${email} already exist` });
      }
      await UserModel.createUser({ name, email, password });
      loger.info({path: req.path, message: `User ${name} wish email ${email} was created`});
      res
        .status(201)
        .json({ message: `User ${name} wish email ${email} was created` });
    } catch (err) {
      next(err);
    }
  };