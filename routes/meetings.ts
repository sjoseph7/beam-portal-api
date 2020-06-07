/**
 * "Meeting" route
 *
 * @desc These are routes for meetings.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { authenticate, authorize } from "../middleware/auth";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Meeting } from "../api/models/Meeting";
import {
  getMeetings,
  getMeeting,
  createMeeting,
  updateMeeting,
  deleteMeeting
} from "../api/controllers/meetings";

const router = Router();

router
  .route("/:id")
  .get(authenticate, authorize("student", "instructor", "admin"), getMeeting)
  .patch(authenticate, authorize("admin"), updateMeeting)
  .delete(authenticate, authorize("admin"), deleteMeeting);

router
  .route("/")
  .get(
    authenticate,
    authorize("student", "instructor", "admin"),
    advancedResults(Meeting, ""),
    getMeetings
  )
  .post(authenticate, authorize("instructor", "admin"), createMeeting);

export default router;
