/**
 * Mongoose "ScheduleItem" Schema
 *
 * @desc This is the schema for a schedule-item.
 */

import { Schema, model, Types } from "mongoose";
import { IScheduleItem } from "../interfaces/IScheduleItem";
import { arrayLengthLimits } from "../utils/arrayLengthLimits";

const _LinkSchema = new Schema({
  text: {
    type: String,
    trim: true,
    maxlength: [100, "link text cannot exceed 100 characters"]
  },
  type: {
    type: String,
    lowercase: true,
    required: [true, "no link type provided"],
    enum: ["adobe-connect", "open-learning"]
  },
  url: {
    type: String,
    trim: true,
    required: [true, "no url provided"],
    maxlength: [1000, "link cannot exceed 1000 characters"]
  }
});

const _TimeSchema = new Schema({
  hour: {
    type: Number,
    required: [true, "no hour provided"],
    min: 0,
    max: 23
  },
  minute: {
    type: Number,
    required: [true, "no minute provided"],
    min: 0,
    max: 59
  }
});

const ScheduleItemSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "no name provided"],
      maxlength: 100
    },
    description: {
      type: String,
      trim: true,
      maxlength: 100
    },
    note: {
      // used for info about 'optional' or 'required for a week'; maybe simplify with optional/required
      type: String,
      trim: true,
      maxlength: 100
    },
    region: {
      type: Types.ObjectId,
      ref: "region",
      required: [true, "no region specified"]
    },
    days: {
      type: [String],
      enum: [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday"
      ],
      lowercase: true,
      required: [true, "no days specified"],
      validate: [arrayLengthLimits(1), "must list at least one day"]
    },
    startTime: {
      _id: false,
      type: _TimeSchema,
      required: [true, "no start time provided"]
    },
    endTime: {
      _id: false,
      type: _TimeSchema,
      required: [true, "no end time provided"]
    },
    hosts: {
      type: [{ type: Types.ObjectId, ref: "person" }],
      required: [true, "no host provided"],
      validate: [arrayLengthLimits(1), "must list at least one host"]
    },
    participants: {
      type: [{ type: Types.ObjectId, ref: "person" }]
    },
    links: {
      _id: false,
      type: [_LinkSchema]
    }
  },
  {
    timestamps: true // This adds fields "createdAt" and "updatedAt" upon any creation or update events
  }
);

export let ScheduleItem = model<IScheduleItem>(
  "schedule-item",
  ScheduleItemSchema
);
