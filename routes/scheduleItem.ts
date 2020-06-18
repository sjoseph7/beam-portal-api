/**
 * "ScheduleItem" route
 *
 * @desc These are routes for schedule-items.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { ErrorResponse } from "../api/utils/errorResponse";
import { ScheduleItem } from "../api/models/ScheduleItem";
import {
  getScheduleItems,
  getScheduleItem,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem
} from "../api/controllers/scheduleItems";
import { checkJwt, checkPermissions } from "../middleware/jwtAuth";

const router = Router();

router
  .route("/:id")
  .get(
    checkJwt,
    checkPermissions("student", "instructor", "admin"),
    getScheduleItem
  )
  .patch(checkJwt, checkPermissions("admin"), updateScheduleItem)
  .delete(checkJwt, checkPermissions("admin"), deleteScheduleItem);

router
  .route("/")
  .get(
    checkJwt,
    checkPermissions("student", "instructor", "admin"),
    advancedResults(ScheduleItem, "hosts participants"),
    getScheduleItems
  )
  .post(checkJwt, checkPermissions("instructor", "admin"), createScheduleItem);

export default router;
