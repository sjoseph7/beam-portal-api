/**
 * "Region" routes
 *
 * @desc These are routes for regions.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { authenticate, authorize } from "../middleware/auth";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Region } from "../api/models/Region";
import {
  getRegions,
  getRegion,
  createRegion,
  updateRegion,
  deleteRegion
} from "../api/controllers/regions";

const router = Router();

router
  .route("/:id")
  .get(authenticate, authorize("student", "instructor", "admin"), getRegion)
  .patch(authenticate, authorize("admin"), updateRegion)
  .delete(authenticate, authorize("admin"), deleteRegion);

router
  .route("/")
  .get(
    authenticate,
    authorize("student", "instructor", "admin"),
    advancedResults(Region, ""),
    getRegions
  )
  .post(authenticate, authorize("instructor", "admin"), createRegion);

export default router;
