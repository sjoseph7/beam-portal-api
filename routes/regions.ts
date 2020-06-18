/**
 * "Region" routes
 *
 * @desc These are routes for regions.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Region } from "../api/models/Region";
import {
  getRegions,
  getRegion,
  createRegion,
  updateRegion,
  deleteRegion
} from "../api/controllers/regions";
import { checkJwt, checkPermissions } from "../middleware/jwtAuth";

const router = Router();

router
  .route("/:id")
  .get(checkJwt, checkPermissions("student", "instructor", "admin"), getRegion)
  .patch(checkJwt, checkPermissions("admin"), updateRegion)
  .delete(checkJwt, checkPermissions("admin"), deleteRegion);

router
  .route("/")
  .get(
    checkJwt,
    checkPermissions("student", "instructor", "admin"),
    advancedResults(Region, ""),
    getRegions
  )
  .post(checkJwt, checkPermissions("instructor", "admin"), createRegion);

export default router;
