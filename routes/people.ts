/**
 * "Person" route
 *
 * @desc These are routes for people.
 */

import { Router, Request, Response, NextFunction } from "express";
import { advancedResults } from "../middleware/advancedResults";
import { ErrorResponse } from "../api/utils/errorResponse";
import { Person } from "../api/models/Person";
import {
  getPeople,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson
} from "../api/controllers/people";
import { checkJwt, checkPermissions } from "../middleware/jwtAuth";

const router = Router();

router
  .route("/:id")
  .get(checkJwt, checkPermissions("student", "instructor", "admin"), getPerson)
  .patch(checkJwt, checkPermissions("admin"), updatePerson)
  .delete(checkJwt, checkPermissions("admin"), deletePerson);

router
  .route("/")
  .get(
    checkJwt,
    checkPermissions("student", "instructor", "admin"),
    advancedResults(
      Person,
      "coursesAsInstructor coursesAsStudent meetingsAsHost meetingsAsParticipant"
    ),
    getPeople
  )
  .post(
    checkJwt,
    checkPermissions("student", "instructor", "admin"),
    createPerson
  );

export default router;
