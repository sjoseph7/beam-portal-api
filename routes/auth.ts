import { authenticate, authorize } from "../middleware/auth";
import {
  register,
  login,
  whoAmI,
  udpateDetails,
  logout,
  updateRole,
  updatePassword,
  forgotPassword,
  resetPassword
} from "../api/controllers/auth";
import { Router, Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../api/utils/errorResponse";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticate, logout);

router
  .route("/details")
  .get(authenticate, whoAmI)
  .patch(authenticate, udpateDetails);

router.patch("/role", authenticate, authorize("admin"), updateRole);

router.patch("/password/:resettoken", resetPassword);

router
  .route("/password")
  .post(forgotPassword)
  .patch(authenticate, updatePassword);

export default router;
