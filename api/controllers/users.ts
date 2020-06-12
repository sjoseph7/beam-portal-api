/**
 * "User" Controller
 *
 * @desc This is a sample controller for a user.
 */

import { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../../middleware/async";
import geocoder from "../utils/geocoder";
import crypto from "crypto";
import colors from "colors";
import path from "path";
import { User } from "../models/User";

// @desc    Get all users
// @route   GET /api/v2/auth/users
// @access  Private/Admin
export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json(res.advancedResults);
  }
);

// @desc    Get one user
// @route   GET /api/v2/auth/users/:id
// @access  Private/Admin
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.params.id);

    //No user found...
    if (!user) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  }
);

// @desc    Create User
// @route   POST /api/v2/auth/users
// @access  Private/Admin
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.create(req.body);
    res.status(201).json({
      success: true,
      data: user
    });
  }
);

// @desc    Update User
// @route   PUT /api/v2/auth/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      data: user
    });
  }
);

// @desc    Delete User
// @route   DELETE /api/v2/auth/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  }
);
