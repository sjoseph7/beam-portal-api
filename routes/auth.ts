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
import { Router } from "express";
import { checkJwt, checkPermissions } from "../middleware/jwtAuth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", checkJwt, logout);

router.route("/details").get(checkJwt, whoAmI).patch(checkJwt, udpateDetails);

router.patch("/role", checkJwt, checkPermissions("admin"), updateRole);

router.patch("/password/:resettoken", resetPassword);

router.route("/password").post(forgotPassword).patch(checkJwt, updatePassword);

export default router;
