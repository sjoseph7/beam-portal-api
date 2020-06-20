/**
 * "Announcement" routes
 *
 * @desc These are routes for announcements.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Announcement } from "../api/models/Announcement";
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from "../api/controllers/announcements";
import { checkJwt, checkPermissions } from "../middleware/jwtAuth";

const router = Router();

router
  .route("/:id")
  .get(
    checkJwt,
    checkPermissions("student", "instructor", "admin"),
    getAnnouncement
  )
  .patch(checkJwt, checkPermissions("instructor", "admin"), updateAnnouncement)
  .delete(
    checkJwt,
    checkPermissions("instructor", "admin"),
    deleteAnnouncement
  );

router
  .route("/")
  .get(
    checkJwt,
    checkPermissions("student", "instructor", "admin"),
    advancedResults(Announcement, ""),
    getAnnouncements
  )
  // .post(checkJwt, checkPermissions("instructor", "admin"), createAnnouncement);
  .post(checkJwt, checkPermissions("instructor", "admin"), createAnnouncement);

export default router;
