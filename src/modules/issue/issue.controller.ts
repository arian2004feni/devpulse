import type { Request, Response } from "express";
import { issueServices } from "./issue.service";
import sendResponse from "../../utils/sendResponse";

export const createIssueController = async(req: Request, res: Response) => {
  try {
    const result = await issueServices.createIssue(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "issue created successfully",
      data: result,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to create issue",
      errors: error,
    });
  }
}