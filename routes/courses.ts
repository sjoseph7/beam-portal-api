/**
 * "Course" route
 *
 * @desc These are routes for courses.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { authenticate, authorize } from "../middleware/auth";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Course } from "../api/models/Course";
import {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} from "../api/controllers/courses";

const router = Router();

router
  .route("/:id")
  .get(authenticate, authorize("student", "instructor", "admin"), getCourse)
  .patch(authenticate, authorize("admin"), updateCourse)
  .delete(authenticate, authorize("admin"), deleteCourse);

router
  .route("/")
  .get(
    authenticate,
    authorize("student", "instructor", "admin"),
    advancedResults(Course, ""),
    getCourses
  )
  .post(authenticate, authorize("instructor", "admin"), createCourse);

export default router;
