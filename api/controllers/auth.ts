import { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../utils/errorResponse";
import { asyncHandler } from "../../middleware/async";
import { IUser } from "../interfaces/IUser";
import { User } from "../models/User";
import crypto from "crypto";

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, role } = req.body;

    // Create user
    const user = await User.create({
      email,
      password,
      role
    });

    sendTokenResponse(res, user, 200);
  }
);

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorResponse(`No email or password provided`, 400));
    }

    // Create user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorResponse(`Invalid credentials`, 401));
    }
    // ^3
    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse(`Invalid credentials`, 401));
    }

    sendTokenResponse(res, user, 200);
  }
);

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 1000),
      httpOnly: true
    });
    res.status(200).json({
      success: true,
      data: {}
    });
  }
);

// @desc    Get current logged in user
// @route   GET /api/v1/auth/details
// @access  Private
export const whoAmI = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user && req.user.id;
    const user = await User.findById(req.user && req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  }
);

// @desc    Update user details (excluding password and role)
// @route   PATCH /api/v1/auth/details
// @access  Private
export const udpateDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const relevantFields = { email: req.body.email };

    const user = await User.findByIdAndUpdate(
      req.user && req.user.id,
      relevantFields,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  }
);

// @desc    Update user role
// @route   PATCH /api/v1/auth/role
// @access  Private
export const updateRole = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const relevantFields = { role: req.body.role };

    const user = await User.findByIdAndUpdate(
      req.user && req.user.id,
      relevantFields,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  }
);

// @desc    Update password
// @route   PATCH /api/v1/auth/password
// @access  Private
export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user && req.user.id).select(
      "password"
    );

    if (!user) {
      return next(new ErrorResponse(`Resource not found`, 404));
    }

    // Check current password
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return next(new ErrorResponse(`Password is not correct`, 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(res, user, 200);
  }
);

// @desc    Forgot password
// @route   POST /api/v1/auth/password
// @access  Public
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email }); //.select("password");

    if (!user) {
      return next(
        new ErrorResponse(`No user with email '${req.body.email}' exists`, 404)
      );
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/password/${resetToken}`;

    const message = `You are receiving this message because you (or someone else) has requested the reset of a password. Please make a PATCH request to: ${resetUrl}`;

    console.info(message);

    res.status(200).json({
      success: true,
      data: message
    });
  }
);

// @desc    Reset password
// @route   PUT /api/v1/auth/password/:resettoken
// @access  Public
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get hashed token
    const __resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex");

    const user = await User.findOne({
      __resetPasswordToken,
      __resetPasswordExpiration: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse(`Invalid token`, 400));
    }
    // Set new password ( and remove reset token )
    user.password = req.body.password;
    user.__resetPasswordToken = undefined;
    user.__resetPasswordExpiration = undefined;
    await user.save();

    sendTokenResponse(res, user, 200);
  }
);

// ==== HELPERS ==== //

// Get token, create cookie, send response
const sendTokenResponse = (res: Response, user: any, statusCode: number) => {
  // Creatw Token
  const token = user.getSignedJwt();
  const options = {
    expires: new Date(
      Date.now() +
        ((process.env.JWT_COOKIE_EXPIRE || 1) as number) * 24 * 60 * 60 * 1000
    ), // Days converted into millis
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token });
};
