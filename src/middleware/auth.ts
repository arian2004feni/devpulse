import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import { pool } from "../config/db";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "unauthorized access",
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret as string) as JwtPayload;

    const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      decoded.email,
    ]);

    const user = userData.rows[0];
    if (userData.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "user not found at auth middleware",
      });
    }

    req.user = decoded;

    next();
  } catch (error) {
    next(error)
  }
};

export default auth;
