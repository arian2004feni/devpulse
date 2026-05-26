import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";

const createIssue = async (payload: any, id: number) => {
  const {title, description, type} = payload;

  const result = await pool.query(
    `INSERT INTO issues (title, description, type, reporter_id) VALUES ($1, $2, $3, $4) RETURNING *`,
    [title, description, type, id],
  );

  return result.rows[0];
};

const getAllIssues = async () => {
  const result = await pool.query(`SELECT * FROM issues`);
  return result.rows;
};

const getIssueById = async(id: number) => {
  const result = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);
  if(result.rows.length === 0){
    throw new Error("Issue not found")
  }

  return result.rows[0];
}

const updateIssue = async(id: number, payload: any) => {
  const {title, description, type} = payload;

  const existingIssue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);

  if(existingIssue.rows.length === 0) {
    throw new Error("issue not found");
  }

  const result = await pool.query(
    `UPDATE issues SET title=$1, description=$2, type=$3 WHERE id=$4 RETURNING *`,
    [title, description, type, id],
  );
  return result.rows[0];
}

const deleteIssue = async(id: number) => {
  const existingIssue = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);

  if(existingIssue.rows.length === 0){
    throw new Error("Issue not found");
  }

  const result = await pool.query(`DELETE FROM issues WHERE id=$1 RETURNING *`, [id]);
  return result.rows[0];
}

export const issueServices = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssue,
  deleteIssue
}
