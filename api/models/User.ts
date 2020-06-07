/**
 * Mongoose "User" Schema
 *
 * @desc This is the schema for a user.
 */

import { model, HookNextFunction, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../interfaces/IUser";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      maxlength: 100,
      required: [true, "no email address provided"],
      unique: [true, "email already exists"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "provided email address is not valid"
      ]
    },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      required: [true, "no role provided"]
    },
    password: {
      type: String,
      required: [true, "no password provided"],
      minLength: 8,
      maxlength: 500,
      select: false // This prevents the property from appearing in requests for users (unless specifically requested)
    },
    __resetPasswordToken: String,
    __resetPasswordExpiration: Date,
    _dbRef: {
      type: Schema.Types.ObjectId,
      refPath: "role" // TODO: determine if you can use a function here to filter 'admin'
    }
  },
  {
    timestamps: true // This adds fields "createdAt" and "updatedAt" upon any creation or update events
  }
);

// Encrypt password
UserSchema.pre("save", async function (this: IUser, next: HookNextFunction) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (err) {
    throw err;
  }
});

// Compare provided password and hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwt = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Generate & hash reset password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.__resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiration
  this.__resetPasswordExpiration =
    Date.now() +
    ((process.env.PASSWORD_RESET_TOKEN_EXPIRE || 1) as number) * 60 * 1000;

  return resetToken;
};

export const User = model<IUser>("user", UserSchema);
