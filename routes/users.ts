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
import { checkJwt, checkPermissions } from "../middleware/jwtAuth";

const router = Router();

router
  .route("/:id")
  .get(getUser)
  .patch(checkJwt, checkPermissions("admin"), updateUser)
  .delete(checkJwt, checkPermissions("admin"), deleteUser);

router
  .route("/")
  .get(checkJwt, checkPermissions("admin"), advancedResults(User, ""), getUsers)
  .post(checkJwt, checkPermissions("admin"), createUser);

export default router;
