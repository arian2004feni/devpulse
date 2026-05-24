import type { NextFunction, Request, Response } from "express";

export const role = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }
    next();
  };
};
