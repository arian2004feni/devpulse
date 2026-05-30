import type { Request, Response } from "express";
import { issueServices } from "./issue.service";
import sendResponse from "../../utils/sendResponse";
import type { JwtPayload } from "jsonwebtoken";

export const createIssueController = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const result = await issueServices.createIssue(req.body, user.id);
    sendResponse(res, 201, {
      success: true,
      message: "issue created successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, error.statusCode || 500, {
      success: false,
      message: error.message || "Failed to create issue",
      errors: error,
    });
  }
};

export const getAllIssuesController = async (req: Request, res: Response) => {
  try {
    const result = await issueServices.getAllIssues(req.query);
    sendResponse(res, 200, {
      success: true,
      message: "issues retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, error.statusCode || 500, {
      success: false,
      message: error.message || "Failed to retrieve issues",
      errors: error,
    });
  }
};

export const getIssueByIdController = async (req: Request, res: Response) => {
  try {
    const result = await issueServices.getIssueById(Number(req.params.id));
    sendResponse(res, 200, {
      success: true,
      message: "issue retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, error.statusCode || 500, {
      success: false,
      message: error.message || "Failed to retrieve issue",
      errors: error,
    });
  }
};

export const updateIssueController = async (req: Request, res: Response) => {
  try {
    const result = await issueServices.updateIssue(
      Number(req.params.id),
      req.body,
      req.user as JwtPayload
    );
    sendResponse(res, 200, {
      success: true,
      message: "issue updated successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, error.statusCode || 500, {
      success: false,
      message: error.message || "Failed to update issue",
      errors: error,
    });
  }
};

export const deleteIssueController = async (req: Request, res: Response) => {
  try {
    await issueServices.deleteIssue(Number(req.params.id));
    sendResponse(res, 200, {
      success: true,
      message: "issue deleted successfully"
    });
  } catch (error: any) {
    sendResponse(res, error.statusCode || 500, {
      success: false,
      message:  error.message || "Failed to delete issue",
      errors: error,
    });
  }
};
