/**
 * Mongoose "Person" Schema
 *
 * @desc This is the schema for a person.
 */

import { Schema, model, Types, HookNextFunction } from "mongoose";
import { IPerson } from "../interfaces/IPerson";
import { arrayLengthLimits } from "../utils/arrayLengthLimits";

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
      type: String,
      trim: true,
      required: [true, "no username provided"]
    },
    type: {
      type: String,
      enum: ["student", "instructor", "staff", "admin"],
      lowercase: true,
      required: [true, "no person type specified"]
    },
    regions: {
      type: [{ type: Types.ObjectId, ref: "region" }],
      required: [true, "no region(s) specified"],
      validate: [arrayLengthLimits(1), "must list at least one region"]
    }
  },
  {
    timestamps: true, // This adds fields "createdAt" and "updatedAt" upon any creation or update events
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

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
