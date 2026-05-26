import { pool } from "../../config/db";
import config from "../../config/env";
import type { IUser } from "./auth.interface";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerUser = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );

  if (existingUser.rows.length > 0) {
    throw new Error("user already Exist");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const values = [name, email, hashedPassword, role || "contributor"];

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
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
    throw new Error("user Not found");
  }

  const passwordCheck = await bcrypt.compare(password, user.password);

  if (!passwordCheck) {
    throw new Error("invalid credentials");
  }

  const token = {
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
  };

  const acceessToken = jwt.sign(token, config.jwtSecret as string, {
    expiresIn: "7d",
  });

  return { acceessToken };
};

export const authService = {
  registerUser,
  loginUser,
};
