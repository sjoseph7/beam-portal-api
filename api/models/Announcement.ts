/**
 * Mongoose "Announcement" Schema
 *
 * @desc This is the schema for an announcement.
 */

import { Schema, model, Types } from "mongoose";
import { IAnnouncement } from "../interfaces/IAnnouncement";

const AnnouncementSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 100,
      required: [true, "no title provided"]
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500
    },
    regions: {
      type: [Types.ObjectId],
      ref: "region"
    },
    recipients: {
      type: [Types.ObjectId],
      ref: "person"
    }
  },
  {
    timestamps: true // This adds fields "createdAt" and "updatedAt" upon any creation or update events
  }
);

export let Announcement = model<IAnnouncement>(
  "announcement",
  AnnouncementSchema
);
