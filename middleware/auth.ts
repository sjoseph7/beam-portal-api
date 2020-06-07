import { ErrorResponse } from "../api/utils/errorResponse";
import { Request, Response, NextFunction } from "express";
import { IJWT } from "../api/interfaces/IJWT";
import { User } from "../api/models/User";
import { asyncHandler } from "./async";
import jwt from "jsonwebtoken";

export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Set token from Bearer token (in header)
      token = req.headers.authorization.split(" ")[1];
    }
    // * Add if you don't want to send the token in the header every time
    // else if (req.cookies.token) {
    // Set token from cookie
    // token = req.cookies.token;
    // }

    if (!token) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }

    try {
      // Verify token
      const decoded = <IJWT>jwt.verify(token, process.env.JWT_SECRET || "");
      if (typeof decoded === "string") {
        throw Error();
      }
      req.user = await User.findById(decoded && decoded.id);
      next();
    } catch (err) {
      return next(
        new ErrorResponse("Not authorized to access this route", 401)
      );
    }
  }
);

// Detect role
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Reject users with invalid roles
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(
          `Role '${req.user.role}' is not authorized to access this route`,
          403
        )
      );
    }
    // Accept users with valid roles
    next();
  };
};
