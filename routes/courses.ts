/**
 * "Course" route
 *
 * @desc These are routes for courses.
 */

import jwtAuthz from "express-jwt-authz";
import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Course } from "../api/models/Course";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} from "../api/controllers/courses";
import { checkJwt, checkPermissions } from "../middleware/jwtAuth";

const router = Router();

router
  .route("/:id")
  .get(checkJwt, checkPermissions("student"), getCourse)
  .patch(checkJwt, checkPermissions("admin"), updateCourse)
  .delete(checkJwt, checkPermissions("admin"), deleteCourse);

router
  .route("/")
  .get(
    checkJwt,
    checkPermissions("student", "instructor", "admin"),
    advancedResults(Course, ""),
    getCourses
  )
  .post(checkJwt, checkPermissions("instructor", "admin"), createCourse);

export default router;
