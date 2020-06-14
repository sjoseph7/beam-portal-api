/**
 * "ScheduleItem" route
 *
 * @desc These are routes for schedule-items.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { authenticate, authorize } from "../middleware/auth";
import { ErrorResponse } from "../api/utils/errorResponse";
import { ScheduleItem } from "../api/models/ScheduleItem";
import {
  getScheduleItems,
  getScheduleItem,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem
} from "../api/controllers/scheduleItems";

const router = Router();

router
  .route("/:id")
  .get(
    authenticate,
    authorize("student", "instructor", "admin"),
    getScheduleItem
  )
  .patch(authenticate, authorize("admin"), updateScheduleItem)
  .delete(authenticate, authorize("admin"), deleteScheduleItem);

router
  .route("/")
  .get(
    authenticate,
    authorize("student", "instructor", "admin"),
    advancedResults(ScheduleItem, "hosts participants"),
    getScheduleItems
  )
  .post(authenticate, authorize("instructor", "admin"), createScheduleItem);

export default router;
