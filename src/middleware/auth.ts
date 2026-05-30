import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config/env";
import { pool } from "../config/db";
import { StatusCodes } from "http-status-codes";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "unauthorized access",
        });
      }

      const decoded = jwt.verify(
        token as string,
        config.jwtSecret as string,
      ) as JwtPayload;

      const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
        decoded.email,
      ]);
      
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "user not found at middleware",
        });
      }

      if (roles.length && !roles.includes(userData.rows[0].role)) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "forbidden access: role not authorized",
        });
      }

      req.user = decoded;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
