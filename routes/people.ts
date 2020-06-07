/**
 * "Person" route
 *
 * @desc These are routes for people.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { authenticate, authorize } from "../middleware/auth";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Person } from "../api/models/Person";
import {
  getPeople,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson
} from "../api/controllers/people";

const router = Router();

router
  .route("/:id")
  .get(authenticate, authorize("student", "instructor", "admin"), getPerson)
  .patch(authenticate, authorize("admin"), updatePerson)
  .delete(authenticate, authorize("admin"), deletePerson);

router
  .route("/")
  .get(
    authenticate,
    authorize("student", "instructor", "admin"),
    advancedResults(
      Person,
      "coursesAsInstructor coursesAsStudent meetingsAsHost meetingsAsParticipant"
    ),
    getPeople
  )
  .post(
    authenticate,
    authorize("student", "instructor", "admin"),
    createPerson
  );

export default router;
