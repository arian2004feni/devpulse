import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const createIssue = async (payload: any, id: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, type, id],
  );

  return result.rows[0];
};

const getAllIssues = async (query: any) => {
  const { sort = "newest", type, status } = query;

  const conditions: string[] = [];
  const values: any[] = [];

  // Filter by type
  if (type) {
    values.push(type);
    conditions.push(`i.type = $${values.length}`);
  }

  // Filter by status
  if (status) {
    values.push(status);
    conditions.push(`i.status = $${values.length}`);
  }

  // WHERE clause
  const whereClause =
    conditions.length > 0
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

  // ORDER BY clause
  const orderBy =
    sort === "oldest"
      ? "ORDER BY i.created_at ASC"
      : "ORDER BY i.created_at DESC";

  const result = await pool.query(
    `
    SELECT 
      i.id,
      i.title,
      i.description,
      i.type,
      i.status,
      jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'role', u.role
      ) AS reporter,
      i.created_at,
      i.updated_at
    FROM issues i
    LEFT JOIN users u ON i.reporter_id = u.id
    ${whereClause}
    ${orderBy};
    `,
    values
  );

  return result.rows;
};

const getIssueById = async (id: number) => {
  const result = await pool.query(`
    SELECT 
      i.id, i.title, i.description, i.type, i.status, 
      jsonb_build_object(
        'id', u.id,
        'name', u.name,
        'role', u.role
      ) AS reporter,
      i.created_at, i.updated_at
    FROM issues i
    LEFT JOIN users u ON i.reporter_id = u.id
    WHERE i.id=$1;
    `, [id]);
  if (result.rows.length === 0) {
    throw new AppError("Issue not found", StatusCodes.NOT_FOUND);
  }

  return result.rows[0];
};

const updateIssue = async (id: number, payload: any, user: JwtPayload) => {
  const { title, description, type } = payload;

  const existingIssue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);
  const issue = existingIssue.rows;

  if (issue.length === 0) {
    throw new AppError("issue not found", StatusCodes.NOT_FOUND);
  }

  if (
    user.role === "contributor" &&
    (issue[0].reporter_id !== user.id || issue[0].status !== "open")
  ) {
    throw new AppError("forbidden access", StatusCodes.FORBIDDEN);
  }

  const result = await pool.query(
    `UPDATE issues SET title=$1, description=$2, type=$3, updated_at=NOW() WHERE id=$4 RETURNING *`,
    [title, description, type, id],
  );
  return result.rows[0];
};

const deleteIssue = async (id: number) => {
  const existingIssue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [
    id,
  ]);

  if (existingIssue.rows.length === 0) {
    throw new AppError("Issue not found", StatusCodes.NOT_FOUND);
  }

  const result = await pool.query(
    `DELETE FROM issues WHERE id=$1 RETURNING *`,
    [id],
  );

  return;
};

export const issueServices = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
};
