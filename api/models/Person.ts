/**
 * Mongoose "Person" Schema
 *
 * @desc This is the schema for a Person.
 */

import { Schema, model, Types, HookNextFunction } from "mongoose";
import { IPerson } from "../interfaces/IPerson";

const PersonSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "no first name provided"],
      maxlength: [100, "first name cannot exceed 100 characters"]
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "no last name provided"],
      maxlength: [100, "last name cannot exceed 100 characters"]
    },
    email: {
      // read-only (updated when user email is updated)
      type: String,
      trim: true
    }
  },
  {
    timestamps: true, // This adds fields "createdAt" and "updatedAt" upon any creation or update events
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

PersonSchema.virtual("coursesAsInstructor", {
  ref: "course",
  localField: "_id",
  foreignField: "instructor"
});

PersonSchema.virtual("coursesAsStudent", {
  ref: "course",
  localField: "_id",
  foreignField: "students"
});

PersonSchema.virtual("meetingsAsHost", {
  ref: "meeting",
  localField: "_id",
  foreignField: "host"
});

PersonSchema.virtual("meetingsAsParticipant", {
  ref: "meeting",
  localField: "_id",
  foreignField: "participants"
});

export let Person = model<IPerson>("Person", PersonSchema);
