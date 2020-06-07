/**
 * Mongoose "Meeting" Schema
 *
 * @desc This is the schema for a meeting.
 */

import { Schema, model, Types } from "mongoose";
import { IMeeting } from "../interfaces/IMeeting";

const MeetingSchema = new Schema(
  {
    startTime: {
      type: Date,
      required: [true, "no start time provided"]
    },
    endTime: {
      type: Date,
      required: [true, "no end time provided"]
    },
    host: {
      type: Types.ObjectId,
      ref: "person",
      required: [true, "no host provided"]
    },
    participants: {
      type: [Types.ObjectId],
      ref: "person"
    },
    link: {
      type: String,
      trim: true,
      required: [true, "no link provided"],
      maxlength: [1000, "link cannot exceed 1000 characters"]
    }
  },
  {
    timestamps: true // This adds fields "createdAt" and "updatedAt" upon any creation or update events
  }
);

export let Meeting = model<IMeeting>("meeting", MeetingSchema);
