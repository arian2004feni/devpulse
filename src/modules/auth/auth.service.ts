import { pool } from "../../config/db";
import type { IUser } from "./auth.interface";
import bcrypt from "bcrypt";

const registerUser = async (payload: IUser) => {
  const { name, email, password, role } = payload;

  const existingUser = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email],
  );

  if (existingUser.rows.length === 0) {
    throw new Error("user already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // const result = await pool.query(``)

  const values = [name, email, hashedPassword, role || "contributor"];

  const result = await pool.query(
    `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *`,
    values,
  );

  console.log(result);

  return result.rows[0];
};

export const authService = {
  registerUser,
};
