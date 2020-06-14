/**
 * Mongoose "Person" Schema
 *
 * @desc This is the schema for a person.
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
    username: {
      // read-only (updated when user username is updated)
      type: String,
      trim: true,
      required: [true, "no username provided"]
    },
    type: {
      // read-only (updated when user role is updated)
      type: String,
      enum: ["student", "instructor", "admin"],
      lowercase: true,
      required: [true, "no person type specified"]
    },
    region: {
      type: String,
      ref: "region",
      required: [true, "no region specified"]
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
  foreignField: "instructors"
});

PersonSchema.virtual("coursesAsStudent", {
  ref: "course",
  localField: "_id",
  foreignField: "students"
});

PersonSchema.virtual("scheduleItemsAsHost", {
  ref: "schedule-item",
  localField: "_id",
  foreignField: "hosts"
});

PersonSchema.virtual("scheduleItemsAsParticipant", {
  ref: "schedule-item",
  localField: "_id",
  foreignField: "participants"
});

export let Person = model<IPerson>("person", PersonSchema);
