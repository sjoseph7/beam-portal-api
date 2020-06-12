/**
 * "User" Interface
 *
 * @desc This is an interface for a user.
 */

import { Types, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  role: string;
  password: string;
  __passwordResetToken?: string;
  __passwordResetTokenExpiration?: Date;
  _dbRef?: Types.ObjectId;
  getSignedJwt: Function;
  matchPassword: Function;
  getResetPasswordToken: Function;
}
