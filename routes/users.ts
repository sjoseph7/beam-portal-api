/**
 * "User" route
 *
 * @desc This is a sample route for a user.
 */

import { Router, Request, Response, NextFunction } from "express";
import { User } from "../api/models/User";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} from "../api/controllers/users";
import { advancedResults } from "../middleware/advancedResults";
import { ErrorResponse } from "../api/utils/errorResponse";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router
  .route("/:id")
  .get(getUser)
  .patch(authenticate, authorize("admin"), updateUser)
  .delete(authenticate, authorize("admin"), deleteUser);

router
  .route("/")
  .get(authenticate, authorize("admin"), advancedResults(User, ""), getUsers)
  .post(authenticate, authorize("admin"), createUser);

export default router;
