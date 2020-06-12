/**
 * "Announcement" routes
 *
 * @desc These are routes for announcements.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { authenticate, authorize } from "../middleware/auth";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Announcement } from "../api/models/Announcement";
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from "../api/controllers/announcements";

const router = Router();

router
  .route("/:id")
  .get(
    authenticate,
    authorize("student", "instructor", "admin"),
    getAnnouncement
  )
  .patch(authenticate, authorize("admin"), updateAnnouncement)
  .delete(authenticate, authorize("admin"), deleteAnnouncement);

router
  .route("/")
  .get(
    authenticate,
    authorize("student", "instructor", "admin"),
    advancedResults(Announcement, ""),
    getAnnouncements
  )
  .post(authenticate, authorize("instructor", "admin"), createAnnouncement);

export default router;
