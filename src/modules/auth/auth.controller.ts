import type { Request, Response } from "express";
import { authService } from "./auth.service";
import sendResponse from "../../utils/sendResponse";

export const signup = async (req: Request, res: Response) => {
  try {
    const result = await authService.registerUser(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, error.statusCode || 500, {
      success: false,
      message: error.message || "Failed to register user",
      errors: error,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await authService.loginUser(req.body);

    const { refreshToken } = result;
    res.cookie("refreshToken", refreshToken, {
      secure: false, // In Production: set this to true
      httpOnly: true,
    });

    sendResponse(res, 201, {
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, error.statusCode || 500, {
      success: false,
      message: error.message || "Failed to login user",
      errors: error,
    });
  }
};
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await authService.generateFreshToken(
      req.cookies.refreshToken,
    );
    sendResponse(res, 200, {
      success: true,
      message: "Token refreshed successfully",
      data: result,
    });
  } catch (error: any) {
    sendResponse(res, error.statusCode || 500, {
      success: false,
      message: error.message || "Failed to refresh token",
      errors: error,
    });
  }
};
