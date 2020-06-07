/**
 * "User" Interface
 *
 * @desc This is an interface for a user.
 */

import { Types, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  role: string;
  password: string;
  __resetPasswordToken?: string;
  __resetPasswordExpiration?: Date;
  _dbRef?: Types.ObjectId;
  getSignedJwt: Function;
  matchPassword: Function;
  getResetPasswordToken: Function;
}
