import { StatusCodes } from "http-status-codes";
import { pool } from "../../config/db";
import config from "../../config/env";
import AppError from "../../utils/AppError";
import type { IUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";

const registerUser = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new AppError("user already exists", StatusCodes.BAD_REQUEST);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const values = [name, email, hashedPassword, role];

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *`,
    values,
  );

  return result.rows[0];
};

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  const user = result.rows[0];

  if (!user) {
    throw new AppError("user Not found", StatusCodes.NOT_FOUND);
  }

  const passwordCheck = await bcrypt.compare(password, user.password);

  if (!passwordCheck) {
    throw new AppError("invalid credentials", StatusCodes.UNAUTHORIZED);
  }

  const token = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const acceessToken = jwt.sign(token, config.jwtSecret as string, {
    expiresIn: config.secretExpiresIn as any,
  });

  const refreshToken = jwt.sign(token, config.jwtRefreshSecret as string, {
    expiresIn: config.refreshSecretExpiresIn as any,
  });

  return { acceessToken, refreshToken, user };
};

const generateFreshToken = async (token: string) => {
  if (!token) {
    throw new AppError("Unauthorized", StatusCodes.UNAUTHORIZED);
  }

  const decoded = jwt.verify(
    token as string,
    config.jwtRefreshSecret as string,
  ) as JwtPayload;

  const userData = await pool.query(`SELECT * FROM users WHERE email=$1`, [
    decoded.email,
  ]);

  if (userData.rows.length === 0) {
    throw new AppError("User not found!", StatusCodes.NOT_FOUND);
  }
  const user = userData.rows[0];

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const acceessToken = jwt.sign(jwtPayload, config.jwtSecret as string, {
    expiresIn: config.secretExpiresIn as any,
  });

  return { acceessToken };
};

export const authService = {
  registerUser,
  loginUser,
  generateFreshToken,
};
