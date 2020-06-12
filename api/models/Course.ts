/**
 * Mongoose "Course" Schema
 *
 * @desc This is the schema for a course.
 */

import { Schema, model, Types } from "mongoose";
import { ICourse } from "../interfaces/ICourse";
import { arrayLengthLimits } from "../utils/arrayLengthLimits";

const CourseSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "no name provided"],
      maxlength: [100, "name cannot exceed 100 characters"]
    },
    instructors: {
      type: [Types.ObjectId],
      ref: "person",
      required: [true, "no instructors provided"],
      validate: [arrayLengthLimits(1), "must list at least one instructor"]
    },
    students: {
      type: [Types.ObjectId],
      ref: "person"
    }
  },
  {
    timestamps: true // This adds fields "createdAt" and "updatedAt" upon any creation or update events
  }
);

export let Course = model<ICourse>("course", CourseSchema);
